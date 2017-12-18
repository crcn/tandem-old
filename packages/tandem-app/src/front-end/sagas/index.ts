import { delay } from "redux-saga";
import { Kernel } from "aerial-common";
import { createQueue } from "mesh";
import { shortcutsService } from "./shortcuts";
import { mainWorkspaceSaga } from "./workspace";
import { fork, call, select } from "redux-saga/effects";
import { artboardSaga } from "./artboard";
import { syntheticBrowserSaga } from "aerial-browser-sandbox";
import { Dispatcher } from "aerial-common2";
import { frontEndSyntheticBrowserSaga } from "./synthetic-browser";
import { apiSaga } from "./api";

export function* mainSaga() {
  yield fork(artboardSaga);

  // TODO - deprecate this
  yield fork(syntheticBrowserSaga);
  yield fork(mainWorkspaceSaga);
  yield fork(shortcutsService);
  yield fork(frontEndSyntheticBrowserSaga);
  yield fork(apiSaga);
}
