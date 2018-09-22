import { fork, put, take, select, call } from "redux-saga/effects";
import { reactSaga } from "./react";
import { RootState } from "../state";
import {
  CANVAS_TOOL_PREVIEW_BUTTON_CLICKED,
  CanvasToolArtboardTitleClicked
} from "../actions";
import { popupSaga } from "./popup";
import { projectSaga, ProjectSagaOptions } from "./project";
import { shortcutSaga } from "./shortcuts";
import { copyPasteSaga } from "./copy-paste";
import {
  getSyntheticNodeById,
  getSyntheticSourceNode,
  getPCNodeDependency,
  Frame
} from "paperclip";

export type FrontEndSagaOptions = {
  openPreview(frame: Frame, state: RootState);
} & ProjectSagaOptions;

export const createRootSaga = (options: FrontEndSagaOptions) => {
  return function* rootSaga() {
    yield fork(copyPasteSaga);
    yield fork(reactSaga);
    yield fork(popupSaga);
    // yield fork(PaperclipStateSaga);
    yield fork(projectSaga(options));
    yield fork(shortcutSaga);
    yield fork(createPreviewSaga(options));
  };
};
const createPreviewSaga = ({ openPreview }: FrontEndSagaOptions) => {
  return function* previewSaga() {
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

      const opening = yield call(openPreview, frame, state);

      if (!opening) {
        // TODO - need to add instructions here
        alert(`Preview server is not currently configured`);
      }
    }
  };
};
