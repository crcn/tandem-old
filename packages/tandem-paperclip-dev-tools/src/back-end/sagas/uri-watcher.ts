import { fork, call, select, take, cancel, spawn, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { getModulesFileTester, getModulesFilePattern, getPublicFilePath, getReadFile, isPaperclipFile } from "../utils";
import { diffNode, patchNode } from "slim-dom";
import { ApplicationState, getLatestPreviewDocument } from "../state";
import { WATCH_URIS_REQUESTED, fileContentChanged, watchingFiles, INIT_SERVER_REQUESTED, fileRemoved, WATCHING_FILES, FILE_CONTENT_CHANGED, FILE_REMOVED, dependencyGraphLoaded, DEPENDENCY_GRAPH_LOADED, previewEvaluated, FileContentChanged } from "../actions";
import { DependencyGraph, loadModuleDependencyGraph, getAllComponents, runPCFile, getComponentSourceUris } from "paperclip";
import crc32 = require("crc32");
import * as chokidar from "chokidar";
import * as fs from "fs";
import * as glob from "glob";

export function* uriWatcherSaga() {
  yield fork(handleWatchUrisRequest);
  yield fork(handleDependencyGraph);
  yield fork(handleEvaluatedPreviews);
}

function* handleWatchUrisRequest() {
  yield take(INIT_SERVER_REQUESTED);
  let child;
  let chan;
  while(true) {
    const state: ApplicationState = yield select();
    const { watchUris = [], fileCache } = state;

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
          emit(fileContentChanged(path, publicPath, new Buffer(newContent), mtime));
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
    yield take([WATCHING_FILES, FILE_CONTENT_CHANGED, FILE_REMOVED]);
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
  }
}

function* handleEvaluatedPreviews() {
  while(true) {

    // TODO - only run changed files
    // emit diffs for browser
    yield take(DEPENDENCY_GRAPH_LOADED);
    const state = yield select();
    const { graph }: ApplicationState = state;
    const components = getAllComponents(graph);
    const componentSourceUris = getComponentSourceUris(graph);
    for (const componentId in components) {
      const component = components[componentId];
      for (const preview of component.previews) {
        const filePath = componentSourceUris[componentId];
        const entry = {
          componentId,
          filePath,
          previewName: preview.name
        }
        const { document } = yield call(runPCFile, { entry, graph, idSeed: crc32(getReadFile(state)(filePath)) });
        const latestDocument = getLatestPreviewDocument(componentId, preview.name, yield select());
        
        console.log(`Evaluated component ${componentId}:${preview.name}`);

        // patch the previous document to preserve node IDs
        const newDocument = latestDocument ? patchNode(latestDocument, diffNode(latestDocument, document)) : document;

        // TODO - push diagnostics too
        yield put(previewEvaluated(componentId, preview.name, newDocument));
      }
    }
  }
}