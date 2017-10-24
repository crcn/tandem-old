import { fork, call, select, take, cancel, spawn, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { ApplicationState } from "../state";
import { WATCH_URIS_REQUESTED, fileChanged } from "../actions";
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

    const { watchUris = [] }: ApplicationState = yield select();

    console.log("watching: ", watchUris);

    if (child) {
      chan.close();
      cancel(child);
    }

    chan = yield eventChannel((emit) => {
      const watcher = chokidar.watch(watchUris.filter(((uri) => uri.substr(0, 5) === "file:")).map((uri) => (
        uri.replace("file://", "")
      )));
  
      watcher.on("ready", () => {
        watcher.on("change", (path) => {
          emit(fileChanged(path));
        });
        watcher.on("unlink", (path) => {
          emit(fileChanged(path));
        });
      });

      return () => {
        watcher.close();
      };
    });

    child = yield spawn(function*() {
      while(1) {
        const c = yield take(chan);
        yield put(c);
      }
    });
  }
}