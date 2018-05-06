import { fork } from "redux-saga/effects";
import { ipcSaga } from "./ipc";

export function* rootSaga() {
  yield fork(ipcSaga);
}