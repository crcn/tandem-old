import { fork, put, take, select } from "redux-saga/effects";
import { RootComponent } from "../components/root";
import { reactSaga } from "./react";
import { RootState } from "../state";
import {
  projectLoaded,
  CANVAS_TOOL_PREVIEW_BUTTON_CLICKED,
  CanvasToolArtboardTitleClicked
} from "../actions";
// import { PaperclipStateSaga } from "./synthetic-browser";
import { projectSaga } from "./project";
import { shortcutSaga } from "./shortcuts";
import { copyPasteSaga } from "./copy-paste";
import {
  getSyntheticNodeById,
  getSyntheticSourceNode,
  getPCNodeDependency
} from "paperclip";
import { stripProtocol } from "tandem-common";

export function* rootSaga() {
  yield fork(copyPasteSaga);
  yield fork(reactSaga);
  // yield fork(PaperclipStateSaga);
  yield fork(projectSaga);
  yield fork(shortcutSaga);
  yield fork(previewSaga);
}

function* previewSaga() {
  while (1) {
    const { frame }: CanvasToolArtboardTitleClicked = yield take(
      CANVAS_TOOL_PREVIEW_BUTTON_CLICKED
    );
    const state: RootState = yield select();

    const sourceNode = getSyntheticSourceNode(
      getSyntheticNodeById(frame.contentNodeId, state.documents),
      state.graph
    );
    const dep = getPCNodeDependency(sourceNode.id, state.graph);
    window.open(
      `http://localhost:60431/preview.html?entryPath=${stripProtocol(
        dep.uri
      )}&componentId=${sourceNode.id}`
    );
  }
}
