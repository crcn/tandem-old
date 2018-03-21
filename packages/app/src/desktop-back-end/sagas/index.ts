import { fork, select } from "redux-saga/effects";
import { RootState } from "../state";
import { watch as watchFiles } from "chokidar";
import { eventChannel } from "redux-saga";

export function* rootSaga() {
  
};

function* projectWatcherSaga() {
  const state: RootState = yield select();
  
};