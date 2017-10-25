import { fork, call, select, take, cancel, spawn, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
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
    yield take(WATCH_URIS_REQUESTED);

    const { watchUris = [], fileCache }: ApplicationState = yield select();

    console.log("watching: ", watchUris);

    const urisByFilePath = watchUris.filter(((uri) => uri.substr(0, 5) === "file:")).map((uri) => (
      uri.replace("file://", "")
    ));

    if (child) {
      chan.close();
      cancel(child);
    }

    chan = yield eventChannel((emit) => {
      const watcher = chokidar.watch(urisByFilePath);
  
      watcher.on("ready", () => {
        watcher.on("change", (path) => {
          emit(fileChanged(path));
          emit(fileContentChanged(path, fs.readFileSync(path), fs.lstatSync(path).mtime));
        });
        watcher.on("unlink", (path) => {
          emit(fileChanged(path));
        });
      });

      return () => {
        watcher.close();
      };
    });

    const initialFileCache = urisByFilePath.map((filePath) => (
      fileCache.find((item) => item.filePath === filePath) || ({
        filePath: filePath,
        content: fs.readFileSync(filePath),
        mtime: fs.lstatSync(filePath).mtime
      })
    ));

    yield put(watchingFiles(initialFileCache));

    child = yield spawn(function*() {
      while(1) {
        const c = yield take(chan);
        yield put(c);
      }
    });
  }
}