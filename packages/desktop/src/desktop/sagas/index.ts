import { fork, call, take } from "redux-saga/effects";
import { electronSaga } from "./electron";
import { BrowserWindow } from "electron";
import { APP_READY } from "../actions";
import { FRONT_END_ENTRY_FILE_PATH } from "../constants";

export function* rootSaga() {
  yield fork(openMainWindow);
  yield fork(electronSaga);
}

function* openMainWindow() {
  yield take(APP_READY);

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadURL(FRONT_END_ENTRY_FILE_PATH);
}