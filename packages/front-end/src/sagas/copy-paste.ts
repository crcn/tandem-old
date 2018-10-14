import { fork, take, select, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { RootState } from "../state";
import { getSyntheticNodeById, PCNodeClip, getPCNodeClip } from "paperclip";
import { syntheticNodesPasted } from "../actions";
import { xmlToPCNode } from "../utils/paperclip";

export function* copyPasteSaga() {
  yield fork(handleCopy);
  yield fork(handlePaste);
}

function* handleCopy() {
  while (1) {
    const chan = eventChannel(emit => {
      document.addEventListener("copy", (event: ClipboardEvent) => {
        if (
          document.activeElement &&
          /input|textarea/i.test(document.activeElement.tagName)
        ) {
          return;
        }
        emit(event);
      });
      return () => {};
    });

    while (1) {
      const event: ClipboardEvent = yield take(chan);
      const root: RootState = yield select();

      event.clipboardData.setData(
        "text/plain",
        JSON.stringify(
          root.selectedSyntheticNodeIds.map(nodeId => {
            const syntheticNode = getSyntheticNodeById(nodeId, root.documents);
            return getPCNodeClip(syntheticNode, root.frames, root.graph);
          })
        )
      );
      event.preventDefault();
    }
  }
}

function* handlePaste() {
  while (1) {
    const chan = eventChannel(emit => {
      document.addEventListener("paste", (event: ClipboardEvent) => {
        emit(event);

        // TODO - emit paste
      });
      return () => {};
    });

    while (1) {
      const event: ClipboardEvent = yield take(chan);

      const text = event.clipboardData.getData("text/plain");

      // paperclip first
      try {
        const clips = JSON.parse(text) as PCNodeClip[];
        yield put(syntheticNodesPasted(clips));
        event.preventDefault();
        continue;
      } catch (e) {
        console.warn(e);
      }

      // XML next

      try {
        const node = xmlToPCNode(text);
        const clips: PCNodeClip[] = [
          {
            node
          }
        ];
        yield put(syntheticNodesPasted(clips));
        event.preventDefault();
        continue;
      } catch (e) {}
    }
  }
}
