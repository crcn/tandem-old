import { RootState, getActiveWindow } from "../state";
import { fork, take, select, put, call, spawn } from "redux-saga/effects";
import { PROJECT_LOADED, ProjectLoaded, syntheticWindowOpened, SyntheticWindowOpened, SYNTHETIC_WINDOW_OPENED, FILE_NAVIGATOR_ITEM_CLICKED, DEPENDENCY_ENTRY_LOADED, DependencyEntryLoaded, DOCUMENT_RENDERED, documentRendered } from "../actions";
import { getSyntheticWindow, createSyntheticWindow, SyntheticWindow, renderDOM, computeDisplayInfo, waitForDOMReady } from "paperclip";
import { eventChannel } from "redux-saga";

export function* syntheticBrowserSaga() {
  yield fork(handleNavigatorItemClicked);
}


function* handleNavigatorItemClicked() {
  while(1) {
    const {entry}: DependencyEntryLoaded = yield take(DEPENDENCY_ENTRY_LOADED);
    const state: RootState = yield select();
    const window = getSyntheticWindow(entry.uri, state.browser);
    yield call(renderDocuments, window);
  }
}

function* renderDocuments(window: SyntheticWindow) {
  for (const document of window.documents) {
    yield spawn(function*() {
      const doneChan = eventChannel((emit) => {
        document.container.onload = emit;
        return () => {};
      });
      yield take(doneChan);
      const nativeMap = renderDOM(document.container.contentDocument.body, document.root);
      yield call(waitForDOMReady, nativeMap);
      const computedInfo = computeDisplayInfo(nativeMap);
      yield put(documentRendered(window.documents.indexOf(document), computedInfo, window));
    });
  }
}