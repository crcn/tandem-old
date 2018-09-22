import { fork, select, take, put, spawn } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { ipcMain } from "electron";
import { DesktopState } from "../state";
export const pid = Date.now() + "_" + Math.random();

export function* ipcSaga() {
  yield fork(actionSaga);
  yield fork(apiSaga);
}

function* actionSaga() {
  const chan = takeIPCEvents("message");

  while (1) {
    const { arg: message } = yield take(chan);
    message["@@" + pid] = true;
    console.log("incomming IPC message:", message);
    yield spawn(function*() {
      yield put(message);
    });
  }
}

function* apiSaga() {
  yield fork(function* getState() {
    const chan = takeIPCEvents("getServerState");
    while (1) {
      const { event } = yield take(chan);
      const state = yield select();
      event.sender.send("serverState", state);
    }
  });

  yield fork(function* getProjectInfo() {
    const chan = takeIPCEvents("getProjectInfo");
    while(1) {
      const {event} = yield take(chan);
      const state: DesktopState = yield select();
      event.sender.send("projectInfo", { config: state.tdProject, path: state.tdProjectPath });
    }
  })
}

const takeIPCEvents = (eventType: string) =>
  eventChannel(emit => {
    ipcMain.on(eventType, (event, arg) => emit({ event, arg }));
    return () => {};
  });
