import { uncompressRootNode, renderDOM, computedDOMInfo, SlimParentNode, patchDOM, patchNode, pushChildNode, SlimElement, createSlimElement, replaceNestedChild, getVMObjectPath, getVMObjectFromPath, SlimBaseNode  } from "slim-dom";
import { take, spawn, fork, select, call, put, race } from "redux-saga/effects";
import { Point, shiftPoint } from "aerial-common2";
import { delay, eventChannel } from "redux-saga";
import { Moved, MOVED, Resized, RESIZED } from "aerial-common2";
import { LOADED_SAVED_STATE, FILE_CONTENT_CHANGED, FileChanged, artboardLoaded, ARTBOARD_CREATED, ArtboardCreated, ArtboardMounted, ARTBOARD_MOUNTED, artboardDOMComputedInfo, artboardRendered, ARTBOARD_RENDERED, STAGE_TOOL_OVERLAY_MOUSE_PAN_END, StageToolOverlayMousePanning, STAGE_TOOL_OVERLAY_MOUSE_PANNING, artboardScroll, CANVAS_MOTION_RESTED, FULL_SCREEN_SHORTCUT_PRESSED, STAGE_RESIZED, OPEN_ARTBOARDS_REQUESTED, artboardCreated, OpenArtboardsRequested, artboardFocused, artboardPatched, ArtboardPatched, PREVIEW_DIFFED, PreviewDiffed, ARTBOARD_PATCHED } from "../actions";
import { getComponentPreview, getDocumentPreviewDiff } from "../utils";
import { Artboard, Workspace, ApplicationState, getSelectedWorkspace, getArtboardById, getArtboardWorkspace, ARTBOARD,  getStageTranslate, createArtboard, getArtboardByInfo, getArtboardDocumentBody, getArtboardDocumentBodyPath } from "../state";
import { debounce } from "lodash";

const COMPUTE_DOM_INFO_DELAY = 200;
const VELOCITY_MULTIPLIER = 10;
const DEFAULT_MOMENTUM_DAMP = 0.1;
const MOMENTUM_THRESHOLD = 100;
const MOMENTUM_DELAY = 50;

export function* artboardSaga() {
  yield fork(handleLoadAllArtboards);
  // yield fork(handleChangedArtboards);
  yield fork(handleCreatedArtboard);
  yield fork(handleArtboardRendered);
  yield fork(handlePreviewDiffed);
  yield fork(handleMoved);
  yield fork(handleResized);
  yield fork(handleScroll);
  yield fork(handleSyncScroll);
  yield fork(handleArtboardSizeChanges);
  yield fork(handleOpenExternalArtboardsRequested);
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

// function* handleChangedArtboards() {
//   while(1) {
//     const { filePath, publicPath }: FileChanged = yield take(FILE_CONTENT_CHANGED);

//     const state: ApplicationState = yield select();
//     const workspace = getSelectedWorkspace(state);

//     for (const artboard of workspace.artboards) {
//       if (artboard.dependencyUris.indexOf(filePath) !== -1) {
//         yield call(diffArtboard, artboard.$id);
//       }
//     }
//   }
// }

function* handlePreviewDiffed() {
  while(1) {
    const { componentId, previewName, documentChecksum, diff }: PreviewDiffed = yield take(PREVIEW_DIFFED);
    const artboard = getArtboardByInfo(componentId, previewName, yield select());
    if (!artboard) {
      console.error(`artboard ${componentId}:${previewName} not found`);
      continue;
    }

    // likely that the server restarted, or user connection dropped while the document changed.
    if (artboard.checksum !== documentChecksum) {
      console.info(`Checksum mismatch for artboard ${artboard.componentId}:${artboard.previewName}, reloading document.`);
      yield call(reloadArtboard, artboard.$id);
      continue;
    }

    const previewPath = [...getArtboardDocumentBodyPath(artboard)];

    const patchedDoc = patchNode(getVMObjectFromPath(previewPath, artboard.document) as SlimParentNode, diff);

    yield put(
      artboardPatched(
        artboard.$id, 
        replaceNestedChild(
          artboard.document, 
          previewPath,
          patchedDoc
        ),
        patchDOM(diff, patchedDoc as SlimParentNode, artboard.nativeNodeMap, artboard.mount.contentDocument.body)
      )
    );
  }
}

function* handleArtboardRendered() {
  while(1) {
    const { artboardId } = (yield take([ARTBOARD_RENDERED, ARTBOARD_PATCHED])) as ArtboardMounted|ArtboardPatched;
    yield fork(function*() {
      const artboard = getArtboardById(artboardId, yield select());

      // delay for a bit to ensure that the DOM nodes are painted. This is a dumb quick fix that may be racy sometimes. 
      yield call(delay, COMPUTE_DOM_INFO_DELAY);
      yield call(recomputeArtboardInfo, artboard);
    });
  }
}

const RESIZE_TIMEOUT = 10;
function* handleArtboardSizeChanges() {

  while(1) {
    const { artboardId } = yield take(ARTBOARD_RENDERED);
    const artboard = getArtboardById(artboardId, yield select());
    yield fork(function*() {
      const resizeChan = eventChannel((emit) => {
        artboard.mount.contentWindow.addEventListener("resize", debounce(emit, RESIZE_TIMEOUT));
        return () => {};
      });

      while(1) {
        yield take(resizeChan);
        yield call(recomputeArtboardInfo, artboard);
      }
    });
  }
}

function* recomputeArtboardInfo(artboard: Artboard) {
  yield put(artboardDOMComputedInfo(artboard.$id, computedDOMInfo(artboard.nativeNodeMap)));
}

function* reloadArtboard(artboardId: string) {
  yield spawn(function*() {

    // TODO - if state exists, then fetch diffs diffs instead
    const state: ApplicationState = yield select();
    const artboard = getArtboardById(artboardId, state);
    const [dependencyUris, compressedNode] = yield call(getComponentPreview, artboard.componentId, artboard.previewName, state);

    const doc = uncompressRootNode([dependencyUris, compressedNode]);
    const mount = document.createElement("iframe");
    mount.setAttribute("style", `border: none; width: 100%; height: 100%`);
    const renderChan = eventChannel((emit) => {
      mount.addEventListener("load", () => {
        emit(renderDOM(doc, mount.contentDocument.body));
      });
      return () => {};
    });

    yield spawn(function*() {
      yield put(artboardRendered(artboardId, yield take(renderChan)));
    });

    const html: SlimElement = createSlimElement("html", "html", [], [
      createSlimElement("body", "body", [], [doc])
    ]);

    yield put(artboardLoaded(artboard.$id, dependencyUris, html, mount));
  });
}

function* handleCreatedArtboard() {
  while(1) {
    const { artboard }: ArtboardCreated = yield take(ARTBOARD_CREATED);
    yield call(reloadArtboard, artboard.$id);
  }
}

function* handleMoved() {
  while(1) {
    const { point }: Moved = yield take((action: Moved) => action.type === MOVED && action.itemType === ARTBOARD);
  }
}

function* handleResized() {
  const { bounds }: Resized = yield take((action: Resized) => action.type === RESIZED && action.itemType === ARTBOARD);
}

function* handleScroll() {
  let deltaTop  = 0;
  let deltaLeft = 0;
  let currentWindowId: string;
  let panStartScrollPosition: Point;

  let lastPaneEvent: StageToolOverlayMousePanning;

  function* scrollDelta(windowId, deltaY) {
    yield put(artboardScroll(windowId, shiftPoint(panStartScrollPosition, {
      left: 0,
      top: -deltaY
    })));
  }

  yield fork(function*() {
    while(true) {
      const event = lastPaneEvent = (yield take(STAGE_TOOL_OVERLAY_MOUSE_PANNING)) as StageToolOverlayMousePanning;
      const { artboardId, deltaY, center, velocityY: newVelocityY } = event;

      const zoom = getStageTranslate(getSelectedWorkspace(yield select()).stage).zoom;

      yield scrollDelta(artboardId, deltaY / zoom);
    }
  });
  yield fork(function*() {
    while(true) {
      yield take(STAGE_TOOL_OVERLAY_MOUSE_PAN_END);
      const { artboardId, deltaY, velocityY } = lastPaneEvent;

      const zoom = getStageTranslate(getSelectedWorkspace(yield select()).stage).zoom;
      
      yield spring(deltaY, velocityY * VELOCITY_MULTIPLIER, function*(deltaY) {
        yield scrollDelta(artboardId, deltaY / zoom);
      });
    }
  });
}

function* handleSyncScroll() {
  while(1) {
    yield take([STAGE_TOOL_OVERLAY_MOUSE_PANNING]);
    
  }
}

function* spring(start: number, velocityY: number, iterate: Function, damp: number = DEFAULT_MOMENTUM_DAMP, complete: Function = () => {}) {
  let i = 0;
  let v = velocityY;
  let currentValue = start;
  function* tick() {
    i += damp;
    currentValue += velocityY / (i / 1);
    if (i >= 1) {
      return complete();
    }
    yield iterate(currentValue);
    yield call(delay, MOMENTUM_DELAY);
    yield tick();
  }
  yield tick();
}

function* handleOpenExternalArtboardsRequested() {
  while(true) {
    const { artboardInfo }: OpenArtboardsRequested = yield take(OPEN_ARTBOARDS_REQUESTED);

    const state: ApplicationState = yield select();
    const workspace = getSelectedWorkspace(state);
    // const browser = getSyntheticBrowser(state, workspace.browserId);

    let lastExistingArtboard;

    // TODO
    for (const [componentId, previewName] of artboardInfo) {
      const existingArtboard = workspace.artboards.find((artboard) => artboard.componentId === componentId && (!previewName || artboard.previewName === previewName));
      if (existingArtboard) {
        lastExistingArtboard = existingArtboard;
        continue;
      }
      yield put(artboardCreated(lastExistingArtboard = createArtboard({
        componentId,
        previewName
      })))
    }

    if (lastExistingArtboard) {
      yield put(artboardFocused(lastExistingArtboard.$id));
    }
  }
}