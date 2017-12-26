import { delay } from "redux-saga";
import { shortcutsService } from "./shortcuts";
import { mainWorkspaceSaga } from "./workspace";
import { fork, call, select } from "redux-saga/effects";
import { artboardSaga } from "./artboard";
import { Dispatcher } from "aerial-common2";
import { windowSaga } from "./window";
import { frontEndSyntheticBrowserSaga } from "./synthetic-browser";
import { apiSaga } from "./api";

export function* mainSaga() {
  yield fork(artboardSaga);
  yield fork(windowSaga);
  yield fork(mainWorkspaceSaga);
  yield fork(shortcutsService);
  yield fork(frontEndSyntheticBrowserSaga);
  yield fork(apiSaga);
}
