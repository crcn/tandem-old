import { uncompressDocument, renderDOM } from "slim-dom";
import { take, spawn, fork, select, call, put } from "redux-saga/effects";
import { LOADED_SAVED_STATE, FILE_CONTENT_CHANGED, FileChanged, artboardLoaded, ARTBOARD_CREATED, ArtboardCreated } from "../actions";
import { getComponentPreview } from "../utils";
import { Artboard, Workspace, ApplicationState, getSelectedWorkspace, getArtboardById, getArtboardWorkspace } from "../state";

export function* artboardSaga() {
  yield fork(handleLoadAllArtboards);
  yield fork(handleChangedArtboards);
  yield fork(handleCreatedArtboard);
}

function* handleLoadAllArtboards() {
  while(1) {
    yield take(LOADED_SAVED_STATE);
    const state: ApplicationState = yield select();
    const workspace = getSelectedWorkspace(state);
    for (const artboard of workspace.artboards) {
      yield spawn(function*() {
        yield call(reloadArtboard, artboard.$id);
      });
    }
  }
}

function* handleChangedArtboards() {
  while(1) {
    const { filePath, publicPath }: FileChanged = yield take(FILE_CONTENT_CHANGED);

    const state: ApplicationState = yield select();
    const workspace = getSelectedWorkspace(state);

    for (const artboard of workspace.artboards) {
      if (artboard.dependencyUris.indexOf(filePath) !== -1) {
        yield call(reloadArtboard, artboard.$id);
      }
    }
  }
}

function* reloadArtboard(artboardId: string) {
  yield spawn(function*() {

    // TODO - if state exists, then fetch diffs diffs instead
    const state: ApplicationState = yield select();
    const artboard = getArtboardById(artboardId, state);
    const [dependencyUris, compressedNode] = yield call(getComponentPreview, artboard.componentId, artboard.previewName, state);

    const doc = uncompressDocument([dependencyUris, compressedNode]);
    const mount = document.createElement("div");
    renderDOM(doc, mount);

    yield put(artboardLoaded(artboard.$id, dependencyUris, doc, mount));
  });
}

function* handleCreatedArtboard() {
  while(1) {
    const { artboard }: ArtboardCreated = yield take(ARTBOARD_CREATED);
    yield call(reloadArtboard, artboard.$id);
  }
}