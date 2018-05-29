import { fork, put, take, select } from "redux-saga/effects";
import { RootComponent } from "../components/root";
import { reactSaga } from "./react";
import { RootState } from "../state";
import { projectLoaded } from "../actions";
// import { PaperclipStateSaga } from "./synthetic-browser";
import { projectSaga } from "./project";
import { shortcutSaga } from "./shortcuts";
import { copyPasteSaga } from "./copy-paste";

export function* rootSaga() {
  yield fork(copyPasteSaga);
  yield fork(reactSaga);
  // yield fork(PaperclipStateSaga);
  yield fork(projectSaga);
  yield fork(shortcutSaga);
}
