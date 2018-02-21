import { fork, call } from "redux-saga/effects";
import { BrowserWindow, app } from "electron";
import { MAIN_WINDOW_OPTIONS } from "../constants";

export function* mainSaga() {
  yield fork(init);
}

function* init() {
  yield call(openMainWindow);
}

const MAIN_WINDOW_OPTIONS = 

function* openMainWindow() {
  const window = new BrowserWindow(MAIN_WINDOW_OPTIONS);
}