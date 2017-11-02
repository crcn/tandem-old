import { fork, call, select, take, cancel, spawn, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { getComponentsFileTester, getComponentsFilePattern } from "../utils";
import { ApplicationState } from "../state";
import { WATCH_URIS_REQUESTED, fileChanged, fileContentChanged, watchingFiles } from "../actions";
import * as chokidar from "chokidar";
import * as fs from "fs";

export function* uriWatcherSaga() {
  yield fork(handleWatchUrisRequest);
}

function* handleWatchUrisRequest() {
  let child;
  let chan;
  while(true) {
    const state: ApplicationState = yield select();
    const { watchUris = [], fileCache } = state;

    const componentFileTester = getComponentsFileTester(state);

    // remove file path and ensure that it doesn't exist in component pattern.
    const urisByFilePath = watchUris.filter(((uri) => uri.substr(0, 5) === "file:")).map((uri) => (
      uri.replace("file://", "")
    )).filter(filePath => !componentFileTester(filePath));

    const allUris = [
      getComponentsFilePattern(state),
      ...urisByFilePath
    ];

    console.log("watching: ", allUris);

    if (child) {
      chan.close();
      cancel(child);
    }

    chan = yield eventChannel((emit) => {
      const watcher = chokidar.watch(allUris);
  
      watcher.on("ready", () => {

        const emitChange = (path) => {
          emit(fileChanged(path));
          emit(fileContentChanged(path, fs.readFileSync(path), fs.lstatSync(path).mtime));
        }

        watcher.on("add", emitChange);
        watcher.on("change", emitChange);

        watcher.on("unlink", (path) => {
          emit(fileChanged(path));
        });
      });

      return () => {
        watcher.close();
      };
    });

    const filesByUri = fileCache.map((item) => item.filePath);

    const readFile = filePath => {
      return ({
        filePath: filePath,
        a: Math.random(),
        content: fs.readFileSync(filePath),
        mtime: fs.lstatSync(filePath).mtime
      });
    }

    const initialFileCache = urisByFilePath.map((filePath) => (
      fileCache.find((item) => item.filePath === filePath) || readFile(filePath)
    ));

    yield put(watchingFiles(initialFileCache));

    child = yield spawn(function*() {
      while(1) {
        const c = yield take(chan);
        yield put(c);
      }
    });

    yield take(WATCH_URIS_REQUESTED);    
  }
}