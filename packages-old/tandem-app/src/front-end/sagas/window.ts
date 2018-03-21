import { take, fork, select, put } from "redux-saga/effects";
import { windowResized } from "../actions";
import { ApplicationState } from "../state";
import { eventChannel } from "redux-saga";

export function* windowSaga() {
  yield fork(handleWindowResized);
}

function* handleWindowResized() {
  const resizeChan = eventChannel((emit) => {
    window.addEventListener("resize", emit);
    return () => {};
  });

  while(1) {
    yield take(resizeChan);
    yield put(windowResized(window.innerWidth, window.innerHeight));
  }
}