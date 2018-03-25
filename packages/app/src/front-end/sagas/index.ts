import { fork, put, take, select } from "redux-saga/effects";
import { RootComponent } from "../components/root";
import { reactSaga } from "./react";
import { RootState } from "../state";
import { projectLoaded } from "../actions";
import { syntheticBrowserSaga } from "./synthetic-browser";
import { projectSaga } from "./project";

export function* rootSaga() {
  yield fork(reactSaga);
  yield fork(syntheticBrowserSaga);
  yield fork(projectSaga);
}
