import { fork, call, select, take, cancel, spawn, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { getModulesFileTester, getModulesFilePattern, getPublicFilePath } from "../utils";
import { ApplicationState } from "../state";
import { WATCH_URIS_REQUESTED, fileContentChanged, watchingFiles, INIT_SERVER_REQUESTED, fileRemoved } from "../actions";
import * as chokidar from "chokidar";
import * as fs from "fs";
import * as glob from "glob";

export function* uriWatcherSaga() {
  yield fork(handleWatchUrisRequest);
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
        content: fs.readFileSync(filePath),
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
          const newContent = fs.readFileSync(path);

          const publicPath = getPublicFilePath(path, state);
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