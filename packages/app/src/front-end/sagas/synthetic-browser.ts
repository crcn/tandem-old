import { RootState, getActiveWindow } from "../state";
import { fork, take, select, put, call, spawn } from "redux-saga/effects";
import { PROJECT_LOADED, ProjectLoaded, syntheticWindowOpened, SyntheticWindowOpened, SYNTHETIC_WINDOW_OPENED, FILE_NAVIGATOR_ITEM_CLICKED, DEPENDENCY_ENTRY_LOADED, DependencyEntryLoaded, DOCUMENT_RENDERED, documentRendered, RESIZER_MOVED } from "../actions";
import { getSyntheticWindow, createSyntheticWindow, SyntheticWindow, renderDOM, computeDisplayInfo, waitForDOMReady, SyntheticDocument, SyntheticNativeNodeMap } from "paperclip";
import { eventChannel } from "redux-saga";

export function* syntheticBrowserSaga() {
  yield fork(handleNavigatorItemClicked);
  yield fork(handleSyntheticDocumentRootChanged);
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
        const onDone = event => {
          document.container.removeEventListener('load', onDone);
          emit(event);
        };
        document.container.addEventListener('load', onDone);
        return () => {};
      });
      yield take(doneChan);
      const nativeMap = renderDOM(document.container.contentDocument.body, document.root);
      yield call(waitForDOMReady, nativeMap);
      yield call(componentDocumentDisplayInfo, document.id, nativeMap);
    });
  }
}


function* componentDocumentDisplayInfo(documentId: string, nativeNodeMap: SyntheticNativeNodeMap) {
  yield put(documentRendered(documentId, computeDisplayInfo(nativeNodeMap), nativeNodeMap));
}

function* handleSyntheticDocumentRootChanged() {

  while(1) {
    yield take([RESIZER_MOVED]);
    // console.log("MOVED");
  }
}