import { fork, put, take, select } from "redux-saga/effects";
import { RootComponent } from "../components/root";
import * as ReactDOM from "react-dom";
import * as React from "react";
import { testProjectLoaded } from "../actions";
import { RootState } from "../state";

export function* rootSaga() {
  yield fork(testProjectSaga);
  yield fork(reactSaga);
  yield fork(handleActiveFileChanged);
}

function* testProjectSaga() {

  // TODO - save changes to project
  yield put(testProjectLoaded({
    path: "test.pc",
    content: new Buffer(``)
  }));
}

function* reactSaga() {
  while(1) {
    const state: RootState = yield select();
    ReactDOM.render(React.createElement(RootComponent), state.mount);
    yield take();
  }
}

function* handleActiveFileChanged() {
  
}