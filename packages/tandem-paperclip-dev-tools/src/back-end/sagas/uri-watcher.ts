import { fork, call, select, take, cancel, spawn, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { getModulesFileTester, getModulesFilePattern, getPublicFilePath, getReadFile, isPaperclipFile } from "../utils";
import { diffNode, patchNode, stringifyNode, SlimParentNode, flattenObjects, getDocumentChecksum, getVmObjectSourceUris } from "slim-dom";
import { ApplicationState, getLatestPreviewDocument } from "../state";
import { WATCH_URIS_REQUESTED, fileContentChanged, watchingFiles, INIT_SERVER_REQUESTED, fileRemoved, WATCHING_FILES, FILE_CONTENT_CHANGED, FILE_REMOVED, dependencyGraphLoaded, DEPENDENCY_GRAPH_LOADED, previewEvaluated, FileContentChanged, previewDiffed } from "../actions";
import { DependencyGraph, loadModuleDependencyGraph, getAllComponents, runPCFile, getComponentSourceUris } from "paperclip";
import { diffArray, ARRAY_UPDATE } from "source-mutation";
import { values } from "lodash";
import crc32 = require("crc32");
import * as chokidar from "chokidar";
import * as fs from "fs";
import * as glob from "glob";

export function* uriWatcherSaga() {
  yield fork(handleWatchUrisRequest);
  yield fork(handleDependencyGraph);
}

function* handleWatchUrisRequest() {
  yield take(INIT_SERVER_REQUESTED);
  let child;
  let chan;
  let prevWatchUris = [];

  while(true) {
    const state: ApplicationState = yield select();
    const { watchUris = [], fileCache } = state;

    const diffs = diffArray(watchUris, prevWatchUris, (a, b) => a === b ? 0 : -1);
    const updates = diffs.mutations.filter(mutation => mutation.type === ARRAY_UPDATE);
    if (prevWatchUris.length && updates.length === diffs.mutations.length) {
      console.log("no change");
      continue;
    }

    prevWatchUris = watchUris;

    const componentFileTester = getModulesFileTester(state);

    // remove file path and ensure that it doesn't exist in component pattern.
    const urisByFilePath = watchUris.filter(((uri) => uri.substr(0, 5) === "file:")).map((uri) => (
      uri.replace("file://", "")
    )).filter(filePath => !componentFileTester(filePath));

    const allUris = [
      getModulesFilePattern(state),
      ...urisByFilePath
    ];

    console.log("watching: ", allUris);

    if (child) {
      chan.close();
      cancel(child);
    }
    const readFile = filePath => {
      return ({
        filePath: filePath,
        a: Math.random(),
        content: new Buffer(fs.readFileSync(filePath, "utf8")),
        mtime: fs.lstatSync(filePath).mtime
      });
    };

    const initialFileCache = glob.sync(getModulesFilePattern(state)).map((filePath) => (
      fileCache.find((item) => item.filePath === filePath) || readFile(filePath)
    ));


    chan = yield eventChannel((emit) => {
      const watcher = chokidar.watch(allUris);
  
      watcher.on("ready", () => {

        const emitChange = (path) => {
          
          const mtime = fs.lstatSync(path).mtime;

          const fileCacheItem = initialFileCache.find((item) => item.filePath === path);

          if (fileCacheItem && fileCacheItem.mtime === mtime) {
            return;
          }
          const newContent = fs.readFileSync(path, "utf8");
          const publicPath = getPublicFilePath(path, state);

          // for internal -- do not want this being sent over the network since it is slow
          emit(fileContentChanged(path, publicPath, newContent, mtime));
        }

        watcher.on("add", emitChange);
        watcher.on("change", emitChange);

        watcher.on("unlink", (path) => {
          emit(fileRemoved(path, getPublicFilePath(path, state)));
        });
      });

      return () => {
        watcher.close();
      };
    });
    const filesByUri = fileCache.map((item) => item.filePath);

    yield put(watchingFiles(initialFileCache));

    child = yield spawn(function*() {
      while(1) {
        const c = yield take(chan);
        try {
          yield put(c);
        } catch(e) {
          console.warn("warn ", e);
        }
      }
    });

    yield take(WATCH_URIS_REQUESTED);    
  }
}

function* handleDependencyGraph() {
  while(true) {
    const action = yield take([WATCHING_FILES, FILE_CONTENT_CHANGED, FILE_REMOVED]);
    yield spawn(function*() {
      console.log("loading dependency graph");
      const state: ApplicationState = yield select();
      let graph: DependencyGraph = {};
      for (const fileCacheItem of state.fileCache) {
        if (!isPaperclipFile(fileCacheItem.filePath, state)) {
          continue;
        }
        const { diagnostics, graph: newGraph } = yield call(loadModuleDependencyGraph, fileCacheItem.filePath, {
          readFile: getReadFile(state)
        }, graph);


        if (diagnostics.length) {
          console.error(`Failed to load dependency graph for ${fileCacheItem.filePath}.`);
        }

        graph = newGraph;

      }
      yield put(dependencyGraphLoaded(graph));
      yield call(evaluatePreviews, graph, action.type === FILE_CONTENT_CHANGED ? (action as FileContentChanged).filePath : null);
    });
  }
}

function* evaluatePreviews(graph: DependencyGraph, sourceUri: string) {
  const state = yield select();
  for (const filePath in graph) {
    const dep = graph[filePath];
    if (sourceUri && sourceUri !== filePath && values(dep.resolvedImportUris).indexOf(sourceUri) === -1) {
      continue;
    }

    const { module } = dep;
    for (const component of module.components) {
      for (const preview of component.previews) {
        const entry = {
          componentId: component.id,
          filePath,
          previewName: preview.name
        }
  
        yield spawn(function*() {
          const { document } = runPCFile({ entry, graph, idSeed: crc32(getReadFile(state)(filePath)) });
          const latestDocument = getLatestPreviewDocument(component.id, preview.name, yield select());
          
          console.log(`Evaluated component ${component.id}:${preview.name}`);
  
          let newDocument = document as SlimParentNode;
          let hasDiffs: boolean = false;
  
          if (latestDocument) {
            const diffs = diffNode(latestDocument, newDocument);
            hasDiffs = diffs.length > 0;
            newDocument = patchNode(latestDocument, diffs);
          }
          // TODO - push diagnostics too
          yield put(previewEvaluated(component.id, preview.name, newDocument));
  
          if (latestDocument && hasDiffs) {
            
            const diffs = diffNode(latestDocument, newDocument);
            // push to the public
            yield put(previewDiffed(component.id, preview.name, getDocumentChecksum(latestDocument), diffs));
          }
        });
      }
    }
  }
}
