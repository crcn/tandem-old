import { apiSaga } from "./api";
import { vscodeSaga } from "./vscode";
import { projectSaga } from "./project";
import { START_DEV_SERVER_REQUESTED, STOP_DEV_SERVER_EXECUTED } from "../actions";
import { expresssServerSaga } from "./express-server";
import { take, fork, spawn, call, cancel } from "redux-saga/effects";

export function* mainSaga() {
  yield fork(vscodeSaga);
  yield fork(apiSaga);
  yield fork(projectSaga);
  yield fork(expresssServerSaga);

  // while(true) {
  //   // wait for command to be executed in vscode
  //   yield take(START_DEV_SERVER_REQUESTED);

  //   const proc = yield spawn(function*() {
  //   });

  //   yield take(STOP_DEV_SERVER_EXECUTED);

  //   yield cancel(proc);
  // }
}