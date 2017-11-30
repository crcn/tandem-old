import { fork, take } from "redux-saga/effects";
import * as express from "express";
import { expresssServerSaga } from "./express-server";
import { routesSaga } from "./api";
import { uriWatcherSaga } from "./uri-watcher";
import { screenshotsSaga } from "./screenshots";
import { ipcSaga } from "./ipc";

export function* mainSaga() {
  yield fork(ipcSaga);
  yield fork(screenshotsSaga);
  yield fork(expresssServerSaga);
  yield fork(routesSaga);
  yield fork(uriWatcherSaga);
}

