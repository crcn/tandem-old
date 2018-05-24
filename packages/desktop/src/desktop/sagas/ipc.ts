import { fork, call, take, put, spawn } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { ipcMain } from "electron";
import { isPublicAction } from "tandem-common";
export const pid = Date.now() + "_" + Math.random();

export function* ipcSaga() {
  yield fork(function*() {
    const chan = eventChannel(emit => {
      ipcMain.on("message", (event, arg) => {
        emit(arg);
      });
      return () => {};
    });

    while (1) {
      const message = yield take(chan);
      message["@@" + pid] = true;
      console.log("incomming IPC message:", message);
      yield spawn(function*() {
        yield put(message);
      });
    }
  });
}
