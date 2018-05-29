import { delay } from "redux-saga";
import { shortcutsService } from "./shortcuts";
import { mainWorkspaceSaga } from "./workspace";
import { fork, call, select } from "redux-saga/effects";
import { artboardSaga } from "./artboard";
import { Dispatcher } from "aerial-common2";
import { windowSaga } from "./window";
import { frontEndPaperclipStateSaga } from "./synthetic-browser";
import { apiSaga } from "./api";

export function* mainSaga() {
  yield fork(artboardSaga);
  yield fork(windowSaga);
  yield fork(mainWorkspaceSaga);
  yield fork(shortcutsService);
  yield fork(frontEndPaperclipStateSaga);
  yield fork(apiSaga);
}
