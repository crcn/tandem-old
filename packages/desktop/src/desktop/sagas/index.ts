import { fork, call, take, select } from "redux-saga/effects";
import { electronSaga } from "./electron";
import { BrowserWindow } from "electron";
import { APP_READY } from "../actions";
import { FRONT_END_ENTRY_FILE_PATH } from "../constants";
import { ipcSaga } from "./ipc";
import { APP_LOADED } from "tandem-front-end";
import { DesktopState } from "../state";

export function* rootSaga() {
  yield fork(openMainWindow);
  yield fork(electronSaga);
  yield fork(ipcSaga)
  yield fork(handleLoadProject);
}

function* openMainWindow() {
  yield take(APP_READY);

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadURL(FRONT_END_ENTRY_FILE_PATH);
}

function* handleLoadProject() {
  yield take(APP_LOADED);
  const state: DesktopState = yield select();

  console.log(state);
}