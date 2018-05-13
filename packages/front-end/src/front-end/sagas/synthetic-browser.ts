import { RootState, getActiveWindow } from "../state";
import { fork, take, select, put, call, spawn } from "redux-saga/effects";
import { PROJECT_LOADED, ProjectLoaded, syntheticWindowOpened, SyntheticWindowOpened, SYNTHETIC_WINDOW_OPENED, FILE_NAVIGATOR_ITEM_CLICKED, DEPENDENCY_ENTRY_LOADED, DependencyEntryLoaded, DOCUMENT_RENDERED, documentRendered, RESIZER_MOVED } from "../actions";
import { getSyntheticWindow, createSyntheticWindow, SyntheticWindow, renderDOM, computeDisplayInfo, waitForDOMReady, SyntheticDocument, SyntheticNativeNodeMap } from "../../paperclip";
import { eventChannel } from "redux-saga";
import { diffArray, ArrayOperationalTransformType, ArrayInsertMutation, ArrayUpdateMutation } from "../../common";

export function* syntheticBrowserSaga() {
  yield fork(handleNewWindowDocuments);
  yield fork(handleSyntheticDocumentRootChanged);
}


function* handleNewWindowDocuments() {
  let currentWindows: SyntheticWindow[] = [];
  while(1) {
    const action = yield take();
    const state: RootState = yield select();
    if (state.browser.windows !== currentWindows) {
      const diffs = diffArray(currentWindows, state.browser.windows, (a, b) => a.location === b.location ? 0 : -1);
      for (const diff of diffs) {
        switch(diff.type) {
          case ArrayOperationalTransformType.INSERT: {
            yield call(renderDocuments, (diff as ArrayInsertMutation<SyntheticWindow>).value);
            break;
          }
          case ArrayOperationalTransformType.UPDATE: {
            const { originalOldIndex, index } = diff as ArrayUpdateMutation<SyntheticWindow>;
            const newWindow = state.browser.windows[index];
            const oldWindow = currentWindows.find(window => window.location === newWindow.location);
            if (newWindow !== oldWindow) {
              yield call(renderDocuments, newWindow);
            }
            break;
          }
        }
      }
    }
    currentWindows = state.browser.windows;
  }
}

function* renderDocuments(window: SyntheticWindow) {
  if (!window.documents) {
    return;
  }
  for (const document of window.documents) {
    yield call(renderDocument, document);
  }
}

function* renderDocument(document: SyntheticDocument) {
  if (document.container.contentDocument && document.container.contentDocument.documentElement) {
    return;
  }

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


function* componentDocumentDisplayInfo(documentId: string, nativeNodeMap: SyntheticNativeNodeMap) {
  yield put(documentRendered(documentId, computeDisplayInfo(nativeNodeMap), nativeNodeMap));
}

function* handleSyntheticDocumentRootChanged() {

  while(1) {
    yield take([RESIZER_MOVED]);
    // console.log("MOVED");
  }
}