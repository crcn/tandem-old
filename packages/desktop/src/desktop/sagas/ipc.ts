import { fork, call, take, put, spawn } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import {ipcMain} from "electron"

export function* ipcSaga() {
  const chan = eventChannel((emit) => {
    ipcMain.on("message", (event, arg) => {
      emit(arg);
    });
    return () => {

    };

  })

  while(1) {
    const message = yield take(chan);
    console.log("incomming IPC message:", message);
    yield spawn(function*() {
      yield put(message);
    });
  }
}
