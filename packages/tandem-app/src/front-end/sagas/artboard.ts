import { uncompressRootNode, renderDOM, computedDOMInfo, SlimParentNode, patchDOM, pushChildNode, SlimElement, createSlimElement, replaceNestedChild, getVMObjectPath, getVMObjectFromPath, SlimBaseNode, getDocumentChecksum, setVMObjectIds, prepDiff, patchNode2, patchDOM2, renderDOM2, computedDOMInfo2, getVMObjectIdType, SlimVMObjectType, SET_ATTRIBUTE_VALUE, CSS_SET_STYLE_PROPERTY, SlimCSSStyleRule, getStyleOwnerScopeInfo, getStyleOwnerFromScopeInfo, isCSSPropertyDisabled, VMObject, SlimStyleElement, CSS_DELETE_STYLE_PROPERTY, getStyleValue, CSS_SET_SELECTOR_TEXT, elementMatches } from "slim-dom";
import { take, spawn, fork, select, call, put, race } from "redux-saga/effects";
import { Point, shiftPoint } from "aerial-common2";
import { delay, eventChannel } from "redux-saga";
import { Moved, MOVED, Resized, RESIZED } from "aerial-common2";
import { Mutation, createPropertyMutation, SetPropertyMutation, createSetValueMutation } from "source-mutation";
import { LOADED_SAVED_STATE, FILE_CONTENT_CHANGED, FileChanged, artboardLoaded, ARTBOARD_CREATED, ArtboardCreated, ArtboardMounted, ARTBOARD_MOUNTED, artboardDOMComputedInfo, artboardRendered, ARTBOARD_RENDERED, STAGE_TOOL_OVERLAY_MOUSE_PAN_END, StageToolOverlayMousePanning, STAGE_TOOL_OVERLAY_MOUSE_PANNING, artboardScroll, CANVAS_MOTION_RESTED, FULL_SCREEN_SHORTCUT_PRESSED, STAGE_RESIZED, OPEN_ARTBOARDS_REQUESTED, artboardCreated, OpenArtboardsRequested, artboardFocused, artboardPatched, ArtboardPatched, PREVIEW_DIFFED, PreviewDiffed, ARTBOARD_PATCHED, artboardLoading, CSS_TOGGLE_DECLARATION_EYE_CLICKED, CSSToggleDeclarationEyeClicked, artboardDOMPatched, CSSDeclarationChanged, CSS_DECLARATION_CREATED, CSS_DECLARATION_NAME_CHANGED, CSS_DECLARATION_VALUE_CHANGED, CSS_SELECTOR_TEXT_CHANGED, CSSSelectorTextChanged } from "../actions";
import { getComponentPreview, getDocumentPreviewDiff } from "../utils";
import { Artboard, Workspace, ApplicationState, getSelectedWorkspace, getArtboardById, getArtboardWorkspace, ARTBOARD,  getStageTranslate, createArtboard, getArtboardsByInfo, getArtboardDocumentBody, getArtboardDocumentBodyPath, getWorkspaceVMObject } from "../state";
import { debounce } from "lodash";
import crc32 = require("crc32");

const COMPUTE_DOM_INFO_DELAY = 100;
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
  yield fork(handleToggleCSSDeclaration);
  yield fork(handleCSSChanges);
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

function* handlePreviewDiffed() {
  while(1) {
    const { componentId, previewName, documentChecksum, diff }: PreviewDiffed = yield take(PREVIEW_DIFFED);
    const state: ApplicationState = yield select();
    const artboards = getArtboardsByInfo(componentId, previewName, state);
    if (!artboards.length) {
      console.error(`artboard ${componentId}:${previewName} not found`);
      continue;
    }
    for (const artboard of artboards) {
      const workspace = getArtboardWorkspace(artboard.$id, state);
      
      // likely that the server restarted, or user connection dropped while the document changed.
      if (artboard.checksum !== documentChecksum) {
        console.info(`Checksum mismatch for artboard ${artboard.componentId}:${artboard.previewName}, reloading document.`);
        yield call(reloadArtboard, artboard.$id);
        continue;
      }

      // inserts unique IDs
      const preppedDiff = prepDiff(artboard.originalDocument, diff);
      const previewPath = [...getArtboardDocumentBodyPath(artboard)];

      let document = getVMObjectFromPath(previewPath, artboard.originalDocument) as SlimParentNode;
      let vmObjectMap = artboard.nativeObjectMap;

      // console.log("PATCH", artboard.componentId, artboard.previewName, preppedDiff);
      for (const mutation of preppedDiff) {

        if (canPatchDOM(mutation, document, workspace)) {

          // TODO - map mutation based on disabled props
          vmObjectMap = patchDOM2(mutation, document, artboard.mount.contentDocument.body, vmObjectMap);
        }

        document = patchNode2(mutation, document);
      }

      yield put(
        artboardPatched(
          artboard.$id, 
          replaceNestedChild(
            artboard.originalDocument, 
            previewPath,
            document
          ),
          getDocumentChecksum(document as SlimParentNode),
          vmObjectMap
        )
      );
    }
  }
}

const canPatchDOM = (mutation: Mutation<any>, document: SlimParentNode, workspace: Workspace) => {
  if (mutation.type === CSS_SET_STYLE_PROPERTY) {
    const { name, newValue } = mutation as SetPropertyMutation<any>;
    const target = getVMObjectFromPath(mutation.target, document);
    return !isCSSPropertyDisabled(target.id, name, document, workspace.disabledStyleDeclarations);
  }

  return true;
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
  yield put(artboardDOMComputedInfo(artboard.$id, computedDOMInfo2(artboard.nativeObjectMap)));
}

function* reloadArtboard(artboardId: string) {
  yield spawn(function*() {
    yield put(artboardLoading(artboardId));

    // TODO - if state exists, then fetch diffs diffs instead
    const state: ApplicationState = yield select();
    const artboard = getArtboardById(artboardId, state);
    const [dependencyUris, compressedNode] = yield call(getComponentPreview, artboard.componentId, artboard.previewName, state);

    let doc = uncompressRootNode([dependencyUris, compressedNode]);
    const checksum = getDocumentChecksum(doc as SlimParentNode);
    const idSeed = crc32(checksum + artboard.$id);
    doc = setVMObjectIds(doc, idSeed);

    const mount = document.createElement("iframe");
    mount.setAttribute("style", `border: none; width: 100%; height: 100%`);
    const renderChan = eventChannel((emit) => {
      mount.addEventListener("load", () => {
        emit(renderDOM2(doc, mount.contentDocument.body));
      });
      return () => {};
    });

    yield spawn(function*() {
      yield put(artboardRendered(artboardId, yield take(renderChan)));
    });

    // Unique IDs necessary for the front-end to ensure that other artboards with the same component & preview don't contain the same node IDs.
    const html: SlimElement = createSlimElement("html", "html", [], [
      createSlimElement("body", "body", [], [doc])
    ]);

    yield put(artboardLoaded(artboard.$id, dependencyUris, html, checksum, mount));
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

function* handleToggleCSSDeclaration() {
  while(1) {
    const { artboardId, declarationName, itemId, index }: CSSToggleDeclarationEyeClicked = yield take(CSS_TOGGLE_DECLARATION_EYE_CLICKED);

    const itemType = getVMObjectIdType(itemId);
    const state: ApplicationState = yield select();
    const workspace = getSelectedWorkspace(state);

    yield call(updateSharedArtboards, itemId, artboardId, false, (nestedObject, scopeHash, path, root) => {
      const disabled = workspace.disabledStyleDeclarations[scopeHash][declarationName];

      if (itemType === SlimVMObjectType.STYLE_RULE) {
        return [createPropertyMutation(CSS_SET_STYLE_PROPERTY, path, declarationName, disabled ? null : (nestedObject as SlimCSSStyleRule).style[index].value, null, null, index)];
      }

      return [];
    });
  }
}

function* updateSharedArtboards(itemId: string,  originArtboardId: string,patchDocument: boolean, createMutations: (nestedObject: VMObject, scopeHash: string, path: any[], root: SlimParentNode) => Mutation<any>[]) {
  const itemType = getVMObjectIdType(itemId);
  const state: ApplicationState = yield select();
  const workspace = getSelectedWorkspace(state);

  const scopeInfo = getStyleOwnerScopeInfo(itemId, getArtboardById(originArtboardId, state).document);
  const scopeHash = scopeInfo.join("");

  for (const artboard of workspace.artboards) {

    const owner = getStyleOwnerFromScopeInfo(scopeInfo, artboard);
    if (!owner) {
      continue;
    }

    let document = getArtboardDocumentBody(artboard);
    const ownerPath = getVMObjectPath(owner, document);
    const mutations = createMutations(owner, scopeHash, ownerPath, document);

    let vmObjectMap;

    if (!mutations.length) {
      continue;
    }

    for (const mutation of mutations) {
      vmObjectMap = patchDOM2(mutation, document, artboard.mount.contentWindow.document.body, artboard.nativeObjectMap);

      if (patchDocument) {
        document = patchNode2(mutation, document);
      }
    }

    if (patchDocument) {
      yield put(
        artboardPatched(
          artboard.$id, 
          replaceNestedChild(
            artboard.document, 
            [...getArtboardDocumentBodyPath(artboard)],
            document
          ),
          null,
          vmObjectMap
        )
      );
    } else {
      yield put(artboardDOMPatched(
        artboard.$id, 
        vmObjectMap
      ));
    }

    yield spawn(function*() {
      yield call(delay, COMPUTE_DOM_INFO_DELAY);
      yield call(recomputeArtboardInfo, artboard);
    });
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
    for (const { componentId, previewName, width, height } of artboardInfo) {
      const existingArtboard = workspace.artboards.find((artboard) => artboard.componentId === componentId && (!previewName || artboard.previewName === previewName));
      if (existingArtboard) {
        lastExistingArtboard = existingArtboard;
        continue;
      }
      yield put(artboardCreated(lastExistingArtboard = createArtboard({
        componentId,
        previewName,

        // okay to position here since the artboard will be moved
        // to a better location in the reducer
        bounds: {
          left: 0,
          top: 0,
          right: width,
          bottom: height
        }
      })))
    }

    if (lastExistingArtboard) {
      yield put(artboardFocused(lastExistingArtboard.$id));
    }
  }
}

function* handleCSSChanges() {
  yield fork(handleDeclarationNameChange);
  yield fork(handleDecarationValueChange);
  yield fork(handleSelectorTextChanged);
}

function* handleDeclarationNameChange() {
  while(1) {
    const { ownerId, index, artboardId, name: oldName, value: newName }: CSSDeclarationChanged = yield take(CSS_DECLARATION_NAME_CHANGED);

    console.log(oldName, newName);

    yield call(updateSharedArtboards, ownerId, artboardId, true, (nestedObject, hash, path, root) => {
      if (nestedObject.type === SlimVMObjectType.STYLE_RULE) {
        const rule = nestedObject as SlimCSSStyleRule;
        const value = getStyleValue(oldName, rule.style);
        const mutations = [];
        console.log(newName, value, oldName);
        if (oldName) {
          mutations.push(createPropertyMutation(CSS_SET_STYLE_PROPERTY, path, oldName, null, null, null, index));
        }
        if (newName) {
          mutations.push(createPropertyMutation(CSS_SET_STYLE_PROPERTY, path, newName, value || "", null, null, index));
        }
        return mutations;

      }
      return [];
    });
  }
}

function* handleDecarationValueChange() {
  while(1) {
    const { ownerId, artboardId, name, value, index }: CSSDeclarationChanged = yield take(CSS_DECLARATION_VALUE_CHANGED);
    yield call(updateSharedArtboards, ownerId, artboardId, true, (nestedObject, hash, path, root) => {
      if (nestedObject.type === SlimVMObjectType.STYLE_RULE) {
        const rule = nestedObject as SlimCSSStyleRule;

        if (!value) {
          return [createPropertyMutation(CSS_DELETE_STYLE_PROPERTY, path, name, null, null, null, index)];
        }

        return [createPropertyMutation(CSS_SET_STYLE_PROPERTY, path, name, value, null, null, index)];
      }
      return [];
    });
  }
}

function* handleSelectorTextChanged() {
  while(1) {
    const { styleRuleId, artboardId, newSelectorText }: CSSSelectorTextChanged = yield take(CSS_SELECTOR_TEXT_CHANGED);

    yield call(updateSharedArtboards, styleRuleId, artboardId, true, (styleRule, hash, path, root) => {
      return [
        createSetValueMutation(CSS_SET_SELECTOR_TEXT, path, newSelectorText)
      ];
    });
  }
}