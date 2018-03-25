import { fork, put, take, select } from "redux-saga/effects";
import { RootComponent } from "../components/root";
import { projectLoaded } from "../actions";
import { RootState } from "../state";
import { syntheticBrowserSaga } from "./synthetic-browser";
import { reactSaga } from "./react";

export function* rootSaga() {
  yield fork(testProjectSaga);
  yield fork(reactSaga);
  yield fork(syntheticBrowserSaga);
}

function* testProjectSaga() {

  // TODO - save changes to project
  yield put(projectLoaded(`test.pc`));
}

