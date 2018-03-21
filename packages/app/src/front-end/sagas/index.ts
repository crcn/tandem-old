import { fork, put, take, select } from "redux-saga/effects";
import { RootComponent } from "../components/root";
import * as ReactDOM from "react-dom";
import * as React from "react";
import { projectLoaded } from "../actions";
import { RootState } from "../state";
import { syntheticBrowserSaga } from "./synthetic-browser";

export function* rootSaga() {
  yield fork(testProjectSaga);
  yield fork(reactSaga);
  yield fork(syntheticBrowserSaga);
}

function* testProjectSaga() {

  // TODO - save changes to project
  yield put(projectLoaded(`test.pc`));
}

function* reactSaga() {
  while(1) {
    const state: RootState = yield select();
    ReactDOM.render(React.createElement(RootComponent), state.mount);
    yield take();
  }
}
