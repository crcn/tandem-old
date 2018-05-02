import { fork, take, select, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { RootState } from "../state";
import { SyntheticObjectType, getSyntheticDocumentById, SyntheticDocument, getSyntheticNodeById, SyntheticNode } from "paperclip";
import { syntheticNodesPasted } from "../actions";

export function* copyPasteSaga() {
  yield fork(handleCopy);
  yield fork(handlePaste);
}

function* handleCopy() {
  while(1) {
    const chan = eventChannel((emit) => {
      document.addEventListener("copy", (event: ClipboardEvent) => {
        emit(event);
      });
      return () => {

      };
    });

    while(1) {
      const event: ClipboardEvent = yield take(chan);
      const root: RootState = yield select();
      event.clipboardData.setData("text/plain", JSON.stringify(root.selectionReferences.map(ref => {
        if (ref.type === SyntheticObjectType.DOCUMENT) {
          return (getSyntheticDocumentById(ref.id, root.browser) as SyntheticDocument).root;
        } else {
          return getSyntheticNodeById(ref.id, root.browser);
        }
      })));
      event.preventDefault();
    }
  }
}


function* handlePaste() {
  while(1) {
    const chan = eventChannel((emit) => {
      document.addEventListener("paste", (event: ClipboardEvent) => {

        emit(event);

        // TODO - emit paste
      });
      return () => {

      };
    });

    while(1) {
      const event: ClipboardEvent = yield take(chan);

      const text = event.clipboardData.getData("text/plain");
      try {
        const syntheticNodes = JSON.parse(text) as SyntheticNode[];
        yield put(syntheticNodesPasted(syntheticNodes));
        event.preventDefault();
      } catch(e) {
        console.warn(e);
      }
    }
  }
  // while(1) {
  //   // yield take(SHORTCUT_COPY_KEY_DOWN)
  // }
}