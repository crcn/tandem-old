import { apiSaga } from "./api";
import { vscodeSaga } from "./vscode";
import { devServerSaga } from "./dev-server";
import { START_DEV_SERVER_REQUESTED, STOP_DEV_SERVER_EXECUTED } from "../actions";
import { frontEndSaga } from "./front-end";
import { languageClientSaga } from "./language-client";
import { expresssServerSaga } from "./express-server";
import { take, fork, spawn, call, cancel } from "redux-saga/effects";

export function* mainSaga() {
  yield fork(frontEndSaga);
  yield fork(vscodeSaga);
  yield fork(apiSaga);
  yield fork(devServerSaga);
  yield fork(expresssServerSaga);
  yield fork(languageClientSaga);
}