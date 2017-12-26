import { watch, removed, Struct, moved, stoppedMoving, moveBounds, scaleInnerBounds, resized, keepBoundsAspectRatio, request, shiftBounds, StructReference } from "aerial-common2";
import { take, select, call, put, fork, spawn, cancel } from "redux-saga/effects";
import { kebabCase } from "lodash";
import { delay } from "redux-saga";
import * as path from "path";
import { diffArray, eachArrayValueMutation, ArrayDeleteMutation, ARRAY_DELETE } from "source-mutation";
import { apiGetComponentPreviewURI, apiOpenSourceFile, apiCreateComponent, apiDeleteComponent } from "../utils";
import { 
  RESIZER_MOVED,
  RESIZER_STOPPED_MOVING,
  ResizerMoved,
  resizerStoppedMoving,
  FileRemoved,
  FILE_REMOVED,
  LEFT_KEY_DOWN,
  stageResized,
  LEFT_KEY_UP,
  RIGHT_KEY_DOWN,
  WINDOW_RESIZED,
  RIGHT_KEY_UP,
  API_COMPONENTS_LOADED,
  UP_KEY_DOWN,
  UP_KEY_UP,
  DOWN_KEY_DOWN,
  DOWN_KEY_UP,
  ResizerPathMoved,
  resizerMoved,
  TEXT_EDITOR_CHANGED,
  NEXT_ARTBOARD_SHORTCUT_PRESSED,
  PREV_ARTBOARD_SHORTCUT_PRESSED,
  COMPONENTS_PANE_ADD_COMPONENT_CLICKED,
  RESIZER_PATH_MOUSE_MOVED,
  COMPONENTS_PANE_COMPONENT_CLICKED,
  DeleteShortcutPressed, 
  SOURCE_CLICKED,
  SourceClicked,
  OPEN_NEW_WINDOW_SHORTCUT_PRESSED,
  artboardSelectionShifted,
  CLONE_WINDOW_SHORTCUT_PRESSED,
  DND_ENDED,
  dndHandled,
  DNDEvent,
  deleteShortcutPressed,
  LOADED_SAVED_STATE,
  artboardCreated,
  apiComponentsLoaded ,
  OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED,
  OpenExternalWindowButtonClicked,
  PROMPTED_NEW_WINDOW_URL,
  PromptedNewWindowUrl,
  ComponentsPaneComponentClicked,
  DELETE_SHORCUT_PRESSED, 
  fullScreenTargetDeleted,
  StageToolOverlayClicked, 
  workspaceSelectionDeleted,
  STAGE_MOUSE_CLICKED, 
} from "../actions";

const WINDOW_PADDING = 10;

import { getNestedObjectById, getVMObjectPath } from "slim-dom";

import { 
  Workspace,
  DEFAULT_ARTBOARD_SIZE,
  getStageTranslate,
  getWorkspaceById,
  ApplicationState, 
  getSelectedWorkspace, 
  getArtboardById,
  ARTBOARD,
  Artboard,
  getScaledMouseStagePosition,
  createArtboard,
  getWorkspaceItemBounds,
  getArtboardPreviewUri,
  getWorkspaceSelectionBounds,
  AVAILABLE_COMPONENT,
  getNodeArtboard,
  getArtboardByInfo,
  getBoundedWorkspaceSelection,
  getWorkspaceLastSelectionOwnerArtboard,
  getAvailableComponent,
  getStageToolMouseNodeTargetReference,
  getWorkspaceNode,
} from "../state";
// import { deleteShortcutPressed, , apiComponentsLoaded } from "front-end";

export function* mainWorkspaceSaga() {
  yield fork(openDefaultWindow);
  yield fork(handleMetaClickElement);
  yield fork(handleMetaClickComponentCell);
  yield fork(handleDeleteKeyPressed);
  yield fork(handleNextWindowPressed);
  yield fork(handlePrevWindowPressed);
  // yield fork(handleSelectionMoved);
  yield fork(handleSelectionStoppedMoving);
  yield fork(handleSelectionKeyDown);
  yield fork(handleSelectionKeyUp);
  // yield fork(handleSelectionResized);
  yield fork(handleSourceClicked);
  yield fork(handleOpenExternalWindowButtonClicked);
  yield fork(handleDNDEnded);
  yield fork(handleComponentsPaneEvents);
  yield fork(handleStageContainerResize);
}

function* openDefaultWindow() {
  yield watch((state: ApplicationState) => state.selectedWorkspaceId, function*(selectedWorkspaceId, state) {
    if (!selectedWorkspaceId) return true;
    const workspace = getSelectedWorkspace(state);
    
    // yield put(openSyntheticWindowRequest(`http://localhost:8083/`, workspace.browserId));
    // yield put(openSyntheticWindowRequest("http://browsertap.com/", workspace.browserId));
    // yield put(openSyntheticWindowRequest("https://wordpress.com/", workspace.browserId));
    // yield put(openSyntheticWindowRequest("http://localhost:8080/index.html", workspace.browserId));
    return true;
  });
}

function* handleOpenExternalWindowButtonClicked() {
  while(true) {
    const { artboardId }: OpenExternalWindowButtonClicked = yield take(OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED);
    const state = yield select();
    const artboard = getArtboardById(artboardId, state);
    window.open(getArtboardPreviewUri(artboard, state), "_blank");
  }
}

function* handleMetaClickElement() {
  while(true) {
    const event: StageToolOverlayClicked = yield take((action: StageToolOverlayClicked) => action.type === STAGE_MOUSE_CLICKED && action.sourceEvent.metaKey);
    const state = yield select();
    const targetRef = getStageToolMouseNodeTargetReference(state, event);
    const workspace = getSelectedWorkspace(state);

    // not items should be selected for meta clicks
    // if (workspace.selectionRefs.length) {
    //   continue;
    // }

    if (!targetRef) continue;
    const node = getWorkspaceNode(targetRef[1], workspace);
    
    const artboard = getNodeArtboard(node.id, workspace);
    yield call(apiOpenSourceFile, artboard.componentId, artboard.previewName, artboard.checksum, getVMObjectPath(node, artboard.document), state);
  }
}

function* handleMetaClickComponentCell() {
  while(true) {
    const { componentId, sourceEvent }: ComponentsPaneComponentClicked = yield take((action: StageToolOverlayClicked) => action.type === COMPONENTS_PANE_COMPONENT_CLICKED);
    if (!sourceEvent.metaKey) continue;
    const state: ApplicationState = yield select();
    const workspace = getSelectedWorkspace(state);
    const component = getAvailableComponent(componentId, workspace);
    const artboard = getArtboardByInfo(component.$id, null, state);

    // yield call(apiOpenSourceFile, artboard.componentId, artboard.previewName, artboard.checksum, [0], state);
  }
}


function* handleDeleteKeyPressed() {
  while(true) {
    const action = (yield take(DELETE_SHORCUT_PRESSED)) as DeleteShortcutPressed;
    const state = yield select();
    const { sourceEvent } = event as DeleteShortcutPressed;
    const workspace = getSelectedWorkspace(state);
    for (const [type, id] of workspace.selectionRefs) {
      yield put(workspaceSelectionDeleted(workspace.$id));
      yield put(removed(id, type as any));

      if (workspace.stage.fullScreen && workspace.stage.fullScreen.artboardId === id) {
        yield put(fullScreenTargetDeleted());
      }
    }
  }
}

// function* handleSelectionMoved() {
//   while(true) {
//     const { point, workspaceId, point: newPoint } = (yield take(RESIZER_MOVED)) as ResizerMoved;
//     const state = (yield select()) as ApplicationState;
//     const workspace = getWorkspaceById(state, workspaceId);
//     const translate = getStageTranslate(workspace.stage);

//     const selectionBounds = getWorkspaceSelectionBounds(workspace);
//     for (const item of getBoundedWorkspaceSelection(workspace)) {
//       const itemBounds = getWorkspaceItemBounds(item, workspace);

//       // skip moving window if in full screen mode
//       if (workspace.stage.fullScreen && workspace.stage.fullScreen.artboardId === item.$id) {
//         continue;
//       }

//       yield put(moved(item.$id, item.$type, scaleInnerBounds(itemBounds, selectionBounds, moveBounds(selectionBounds, newPoint)), workspace.targetCSSSelectors));
//     }
//   }
// }

function* handleDNDEnded() {
  while(true) {
    const event = yield take(DND_ENDED);
    const state: ApplicationState = yield select();
    const workspace = getSelectedWorkspace(state);
    const dropRef = getStageToolMouseNodeTargetReference(state, event as DNDEvent);

    if (dropRef) {
      yield call(handleDroppedOnElement, dropRef, event);
    } else {
      yield call(handleDroppedOnEmptySpace, event);
    }

    yield put(dndHandled());
  }
}

function* handleDroppedOnElement(ref: StructReference, event: DNDEvent) {
}

function* handleDroppedOnEmptySpace(event: DNDEvent) {

  const { sourceEvent: { pageX, pageY }} = event;
  const state: ApplicationState = yield select();
  const componentId = event.ref[1];

  const workspace = getSelectedWorkspace(state);
  const availableComponent = workspace.availableComponents.find(component => component.$id === componentId);

  const screenshot = availableComponent.screenshots[0];
  const size = screenshot ? { width: screenshot.clip.right - screenshot.clip.left, height: screenshot.clip.bottom - screenshot.clip.top } : DEFAULT_ARTBOARD_SIZE;
  
  const mousePosition = getScaledMouseStagePosition(state, event);

  yield put(artboardCreated(createArtboard({
    componentId, 
    previewName: null, 
    bounds: {
    ...mousePosition,
    right: mousePosition.left + size.width,
    bottom: mousePosition.top + size.height
  }})));
}

function* handleSelectionResized() {
  while(true) {
    let { workspaceId, anchor, originalBounds, newBounds, sourceEvent } = (yield take(RESIZER_PATH_MOUSE_MOVED)) as ResizerPathMoved;

    const state: ApplicationState = yield select();
 
    const workspace = getWorkspaceById(state, workspaceId);

    // TODO - possibly use BoundsStruct instead of Bounds since there are cases where bounds prop doesn't exist
    const currentBounds = getWorkspaceSelectionBounds(workspace);


    const keepAspectRatio = sourceEvent.shiftKey;
    const keepCenter      = sourceEvent.altKey;

    if (keepCenter) {
      // newBounds = keepBoundsCenter(newBounds, bounds, anchor);
    }

    if (keepAspectRatio) {
      newBounds = keepBoundsAspectRatio(newBounds, originalBounds, anchor, keepCenter ? { left: 0.5, top: 0.5 } : anchor);
    }

    for (const item of getBoundedWorkspaceSelection(workspace)) {
      const innerBounds = getWorkspaceItemBounds(item, workspace);
      const scaledBounds = scaleInnerBounds(currentBounds, currentBounds, newBounds);
      yield put(resized(item.$id, item.$type, scaleInnerBounds(innerBounds, currentBounds, newBounds), workspace.targetCSSSelectors));
    }
  }
}

function* handleSelectionKeyDown() {

  while(true) {
    const { type } = yield take([LEFT_KEY_DOWN, RIGHT_KEY_DOWN, UP_KEY_DOWN, DOWN_KEY_DOWN]);
    const state: ApplicationState = yield select();
    const workspace: Workspace = getSelectedWorkspace(state);
    if (workspace.selectionRefs.length === 0) continue;
    const workspaceId = workspace.$id;
    const bounds = getWorkspaceSelectionBounds(workspace);

    switch(type) {
      case DOWN_KEY_DOWN: {
        yield put(resizerMoved(workspaceId, { left: bounds.left, top: bounds.top + 1 }));
        break;
      }
      case UP_KEY_DOWN: {
        yield put(resizerMoved(workspaceId, { left: bounds.left, top: bounds.top - 1 }));
        break;
      }
      case LEFT_KEY_DOWN: {
        yield put(resizerMoved(workspaceId, { left: bounds.left - 1, top: bounds.top }));
        break;
      }
      case RIGHT_KEY_DOWN: {
        yield put(resizerMoved(workspaceId, { left: bounds.left + 1, top: bounds.top }));
        break;
      }
    }
  }
}

function* handleSelectionKeyUp() {
  while(true) {
    yield take([LEFT_KEY_UP, RIGHT_KEY_UP, UP_KEY_UP, DOWN_KEY_UP]);
    const state: ApplicationState = yield select();
    const workspace: Workspace = getSelectedWorkspace(state);
    yield put(resizerStoppedMoving(workspace.$id, null));
  }
}

function* handleSourceClicked() {
  while(true) {
    const { itemId } = (yield take(SOURCE_CLICKED)) as SourceClicked;

    const state = yield select();

    const item = getWorkspaceNode(itemId, getSelectedWorkspace(state));

    const artboard = getNodeArtboard(item.id, state);
    yield call(apiOpenSourceFile, artboard.componentId, artboard.previewName, artboard.checksum, getVMObjectPath(item, artboard.document), state);
  }
}

function* handleSelectionStoppedMoving() {
  while(true) {
    const { point, workspaceId } = (yield take(RESIZER_STOPPED_MOVING)) as ResizerMoved;
    const state = (yield select()) as ApplicationState;
    const workspace = getWorkspaceById(state, workspaceId);
    for (const item of getBoundedWorkspaceSelection(workspace)) {

      // skip moving window if in full screen mode
      if (workspace.stage.fullScreen && workspace.stage.fullScreen.artboardId === item.$id) {
        continue;
      }
      
      const bounds = getWorkspaceItemBounds(item, workspace);
      yield put(stoppedMoving(item.$id, item.$type, workspace.targetCSSSelectors));
    }
  }
}

// TODO - this would be great, but doesn't work for live editing. 
// function* syncWindowsWithAvailableComponents() {
//   while(true) {
//     yield take(API_COMPONENTS_LOADED);
//     const state: ApplicationState = yield select();

//     const workspace = getWorkspaceById(state, state.selectedWorkspaceId);
//     const availableComponentUris = workspace.availableComponents.map((component) => apiGetComponentPreviewURI(component.$id, state));


//     const browser = getSyntheticBrowser(state, workspace.browserId);
//     const windowUris = browser.windows.map((window) => window.location);

//     const deletes = diffArray(windowUris, availableComponentUris, (a, b) => a === b ? 0 : -1).mutations.filter(mutation => mutation.type === ARRAY_DELETE) as any as ArrayDeleteMutation<string>[];

//     for (const {index} of deletes) {
//       const window = browser.windows[index];
//       window.instance.close();
//     }
//   }
// }

function* handleNextWindowPressed() {
  while(true) {
    yield take(NEXT_ARTBOARD_SHORTCUT_PRESSED);
    yield call(shiftSelectedArtboard, 1);
  }
}

function* handlePrevWindowPressed() {
  while(true) {
    yield take(PREV_ARTBOARD_SHORTCUT_PRESSED);
    yield call(shiftSelectedArtboard, -1);
  }
}

function* shiftSelectedArtboard(indexDelta: number) {
  const state: ApplicationState = yield select();
  const workspace = getSelectedWorkspace(state);
  const artboard = getWorkspaceLastSelectionOwnerArtboard(state, state.selectedWorkspaceId) || workspace.artboards[workspace.artboards.length - 1];
  if (!artboard) {
    return;
  }

  const index = workspace.artboards.indexOf(artboard);
  const change = index + indexDelta

  // TODO - change index based on window location, not index
  const newIndex = change < 0 ? workspace.artboards.length - 1 : change >= workspace.artboards.length ? 0 : change;
  yield put(artboardSelectionShifted(workspace.artboards[newIndex].$id))
}

function* handleComponentsPaneEvents() {
  yield fork(handleComponentsPaneAddClicked);
  yield spawn(handleDeleteComponentsPane);
}

function* handleComponentsPaneAddClicked() {
  while(true) {
    yield take(COMPONENTS_PANE_ADD_COMPONENT_CLICKED);
    const name = prompt("Unique component name");
    if (!name) {
      continue;
    }
    const state: ApplicationState = yield select();
    const workspace = getWorkspaceById(state, state.selectedWorkspaceId);
    const { componentId } = yield call(apiCreateComponent, name, state);
    
    console.error("TODO");
    // yield put(openSyntheticWindowRequest({ location: apiGetComponentPreviewURI(componentId, state)}, workspace.browserId));
  }
}

function* handleDeleteComponentsPane() {
  while(true) {
    yield take(DELETE_SHORCUT_PRESSED);
    const state: ApplicationState = yield select();
    const workspace = getWorkspaceById(state, state.selectedWorkspaceId);
    const componentRefs = workspace.selectionRefs.filter((ref) => ref[0] === AVAILABLE_COMPONENT);

    if (componentRefs.length && confirm("Are you sure you want to delete these components?")) {
      for (const [type, componentId] of componentRefs) {
        const result = yield call(apiDeleteComponent, componentId, state);
        if (result.message) {
          alert(result.message);
        }
      }
    }
  } 
}

function* handleStageContainerResize() {
  while(1) {
    yield take([LOADED_SAVED_STATE, WINDOW_RESIZED]);
    const state: ApplicationState = yield select();
    const workspace = getSelectedWorkspace(state);
    if (!workspace.stage.container) {
      continue;
    }
    const { width, height } = workspace.stage.container.getBoundingClientRect();
    yield put(stageResized(width, height));
  }
}