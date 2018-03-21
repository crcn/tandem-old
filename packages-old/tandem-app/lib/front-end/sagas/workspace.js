"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
var effects_1 = require("redux-saga/effects");
var utils_1 = require("../utils");
var actions_1 = require("../actions");
var WINDOW_PADDING = 10;
var slim_dom_1 = require("slim-dom");
var state_1 = require("../state");
// import { deleteShortcutPressed, , apiComponentsLoaded } from "front-end";
function mainWorkspaceSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(openDefaultWindow)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleMetaClickElement)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleMetaClickComponentCell)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleDeleteKeyPressed)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleNextWindowPressed)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handlePrevWindowPressed)];
            case 6:
                _a.sent();
                // yield fork(handleSelectionMoved);
                return [4 /*yield*/, effects_1.fork(handleSelectionStoppedMoving)];
            case 7:
                // yield fork(handleSelectionMoved);
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionKeyDown)];
            case 8:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionKeyUp)];
            case 9:
                _a.sent();
                // yield fork(handleSelectionResized);
                return [4 /*yield*/, effects_1.fork(handleSourceClicked)];
            case 10:
                // yield fork(handleSelectionResized);
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenExternalWindowButtonClicked)];
            case 11:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleDNDEnded)];
            case 12:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleComponentsPaneEvents)];
            case 13:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleStageContainerResize)];
            case 14:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.mainWorkspaceSaga = mainWorkspaceSaga;
function openDefaultWindow() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, aerial_common2_1.watch(function (state) { return state.selectedWorkspaceId; }, function (selectedWorkspaceId, state) {
                    var workspace;
                    return __generator(this, function (_a) {
                        if (!selectedWorkspaceId)
                            return [2 /*return*/, true];
                        workspace = state_1.getSelectedWorkspace(state);
                        // yield put(openSyntheticWindowRequest(`http://localhost:8083/`, workspace.browserId));
                        // yield put(openSyntheticWindowRequest("http://browsertap.com/", workspace.browserId));
                        // yield put(openSyntheticWindowRequest("https://wordpress.com/", workspace.browserId));
                        // yield put(openSyntheticWindowRequest("http://localhost:8080/index.html", workspace.browserId));
                        return [2 /*return*/, true];
                    });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleOpenExternalWindowButtonClicked() {
    var artboardId, state, artboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED)];
            case 1:
                artboardId = (_a.sent()).artboardId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                artboard = state_1.getArtboardById(artboardId, state);
                window.open(state_1.getArtboardPreviewUri(artboard, state), "_blank");
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function handleMetaClickElement() {
    var event_1, state, targetRef, workspace, node, artboard, json, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.STAGE_MOUSE_CLICKED && action.sourceEvent.metaKey; })];
            case 1:
                event_1 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                targetRef = state_1.getStageToolMouseNodeTargetReference(state, event_1);
                workspace = state_1.getSelectedWorkspace(state);
                // not items should be selected for meta clicks
                // if (workspace.selectionRefs.length) {
                //   continue;
                // }
                if (!targetRef)
                    return [3 /*break*/, 0];
                node = state_1.getWorkspaceVMObject(targetRef[1], workspace);
                artboard = state_1.getNodeArtboard(node.id, workspace);
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 7]);
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, artboard.componentId, artboard.previewName, artboard.checksum, slim_dom_1.getVMObjectPath(node, state_1.getDocumentBodyPreview(artboard.document)), state)];
            case 4:
                json = _a.sent();
                return [3 /*break*/, 7];
            case 5:
                e_1 = _a.sent();
                return [4 /*yield*/, effects_1.put(actions_1.exceptionCaught(e_1))];
            case 6:
                _a.sent();
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 0];
            case 8: return [2 /*return*/];
        }
    });
}
function handleMetaClickComponentCell() {
    var _a, componentId, sourceEvent, state, workspace, component, artboard;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.COMPONENTS_PANE_COMPONENT_CLICKED; })];
            case 1:
                _a = _b.sent(), componentId = _a.componentId, sourceEvent = _a.sourceEvent;
                if (!sourceEvent.metaKey)
                    return [3 /*break*/, 0];
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                component = state_1.getAvailableComponent(componentId, workspace);
                artboard = state_1.getArtboardByInfo(component.$id, null, state);
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function handleDeleteKeyPressed() {
    var action, state, sourceEvent, workspace, _i, _a, _b, type, id;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!true) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.take(actions_1.DELETE_SHORCUT_PRESSED)];
            case 1:
                action = (_c.sent());
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _c.sent();
                sourceEvent = event.sourceEvent;
                workspace = state_1.getSelectedWorkspace(state);
                _i = 0, _a = workspace.selectionRefs;
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                _b = _a[_i], type = _b[0], id = _b[1];
                return [4 /*yield*/, effects_1.put(actions_1.workspaceSelectionDeleted(workspace.$id))];
            case 4:
                _c.sent();
                return [4 /*yield*/, effects_1.put(aerial_common2_1.removed(id, type))];
            case 5:
                _c.sent();
                if (!(workspace.stage.fullScreen && workspace.stage.fullScreen.artboardId === id)) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.put(actions_1.fullScreenTargetDeleted())];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 3];
            case 8: return [3 /*break*/, 0];
            case 9: return [2 /*return*/];
        }
    });
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
function handleDNDEnded() {
    var event_2, state, workspace, dropRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.take(actions_1.DND_ENDED)];
            case 1:
                event_2 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                dropRef = state_1.getStageToolMouseNodeTargetReference(state, event_2);
                if (!dropRef) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.call(handleDroppedOnElement, dropRef, event_2)];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, effects_1.call(handleDroppedOnEmptySpace, event_2)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [4 /*yield*/, effects_1.put(actions_1.dndHandled())];
            case 7:
                _a.sent();
                return [3 /*break*/, 0];
            case 8: return [2 /*return*/];
        }
    });
}
function handleDroppedOnElement(ref, event) {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}
function handleDroppedOnEmptySpace(event) {
    var _a, pageX, pageY, state, componentId, workspace, availableComponent, screenshot, size, mousePosition;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = event.sourceEvent, pageX = _a.pageX, pageY = _a.pageY;
                return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                componentId = event.ref[1];
                workspace = state_1.getSelectedWorkspace(state);
                availableComponent = workspace.availableComponents.find(function (component) { return component.$id === componentId; });
                if (!!availableComponent.screenshots.length) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.put(actions_1.exceptionCaught(new Error("Component must have a preview tag")))];
            case 2: return [2 /*return*/, _b.sent()];
            case 3:
                screenshot = availableComponent.screenshots[0];
                size = screenshot ? { width: screenshot.clip.right - screenshot.clip.left, height: screenshot.clip.bottom - screenshot.clip.top } : state_1.DEFAULT_ARTBOARD_SIZE;
                mousePosition = state_1.getScaledMouseStagePosition(state, event);
                return [4 /*yield*/, effects_1.put(actions_1.artboardCreated(state_1.createArtboard({
                        componentId: componentId,
                        previewName: screenshot.previewName,
                        bounds: __assign({}, mousePosition, { right: mousePosition.left + size.width, bottom: mousePosition.top + size.height })
                    })))];
            case 4:
                _b.sent();
                return [2 /*return*/];
        }
    });
}
function handleSelectionResized() {
    var _a, workspaceId, anchor, originalBounds, newBounds, sourceEvent, state, workspace, currentBounds, keepAspectRatio, keepCenter, _i, _b, item, innerBounds, scaledBounds;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!true) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.RESIZER_PATH_MOUSE_MOVED)];
            case 1:
                _a = (_c.sent()), workspaceId = _a.workspaceId, anchor = _a.anchor, originalBounds = _a.originalBounds, newBounds = _a.newBounds, sourceEvent = _a.sourceEvent;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _c.sent();
                workspace = state_1.getWorkspaceById(state, workspaceId);
                currentBounds = state_1.getWorkspaceSelectionBounds(workspace);
                keepAspectRatio = sourceEvent.shiftKey;
                keepCenter = sourceEvent.altKey;
                if (keepCenter) {
                    // newBounds = keepBoundsCenter(newBounds, bounds, anchor);
                }
                if (keepAspectRatio) {
                    newBounds = aerial_common2_1.keepBoundsAspectRatio(newBounds, originalBounds, anchor, keepCenter ? { left: 0.5, top: 0.5 } : anchor);
                }
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(workspace);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                innerBounds = state_1.getWorkspaceItemBounds(item, workspace);
                scaledBounds = aerial_common2_1.scaleInnerBounds(currentBounds, currentBounds, newBounds);
                return [4 /*yield*/, effects_1.put(aerial_common2_1.resized(item.$id, item.$type, aerial_common2_1.scaleInnerBounds(innerBounds, currentBounds, newBounds), workspace.targetCSSSelectors))];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}
function handleSelectionKeyDown() {
    var type, state, workspace, workspaceId, bounds, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!true) return [3 /*break*/, 12];
                return [4 /*yield*/, effects_1.take([actions_1.LEFT_KEY_DOWN, actions_1.RIGHT_KEY_DOWN, actions_1.UP_KEY_DOWN, actions_1.DOWN_KEY_DOWN])];
            case 1:
                type = (_b.sent()).type;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                if (workspace.selectionRefs.length === 0)
                    return [3 /*break*/, 0];
                workspaceId = workspace.$id;
                bounds = state_1.getWorkspaceSelectionBounds(workspace);
                _a = type;
                switch (_a) {
                    case actions_1.DOWN_KEY_DOWN: return [3 /*break*/, 3];
                    case actions_1.UP_KEY_DOWN: return [3 /*break*/, 5];
                    case actions_1.LEFT_KEY_DOWN: return [3 /*break*/, 7];
                    case actions_1.RIGHT_KEY_DOWN: return [3 /*break*/, 9];
                }
                return [3 /*break*/, 11];
            case 3: return [4 /*yield*/, effects_1.put(actions_1.resizerMoved(workspaceId, { left: bounds.left, top: bounds.top + 1 }))];
            case 4:
                _b.sent();
                return [3 /*break*/, 11];
            case 5: return [4 /*yield*/, effects_1.put(actions_1.resizerMoved(workspaceId, { left: bounds.left, top: bounds.top - 1 }))];
            case 6:
                _b.sent();
                return [3 /*break*/, 11];
            case 7: return [4 /*yield*/, effects_1.put(actions_1.resizerMoved(workspaceId, { left: bounds.left - 1, top: bounds.top }))];
            case 8:
                _b.sent();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, effects_1.put(actions_1.resizerMoved(workspaceId, { left: bounds.left + 1, top: bounds.top }))];
            case 10:
                _b.sent();
                return [3 /*break*/, 11];
            case 11: return [3 /*break*/, 0];
            case 12: return [2 /*return*/];
        }
    });
}
function handleSelectionKeyUp() {
    var state, workspace;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take([actions_1.LEFT_KEY_UP, actions_1.RIGHT_KEY_UP, actions_1.UP_KEY_UP, actions_1.DOWN_KEY_UP])];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                return [4 /*yield*/, effects_1.put(actions_1.resizerStoppedMoving(workspace.$id, null))];
            case 3:
                _a.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleSourceClicked() {
    var itemId, state, item, artboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.SOURCE_CLICKED)];
            case 1:
                itemId = (_a.sent()).itemId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                item = state_1.getWorkspaceVMObject(itemId, state_1.getSelectedWorkspace(state));
                artboard = state_1.getNodeArtboard(item.id, state);
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, artboard.componentId, artboard.previewName, artboard.checksum, slim_dom_1.getVMObjectPath(item, state_1.getDocumentBodyPreview(artboard.document)), state)];
            case 3:
                _a.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleSelectionStoppedMoving() {
    var _a, point, workspaceId, state, workspace, _i, _b, item, bounds;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!true) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.RESIZER_STOPPED_MOVING)];
            case 1:
                _a = (_c.sent()), point = _a.point, workspaceId = _a.workspaceId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = (_c.sent());
                workspace = state_1.getWorkspaceById(state, workspaceId);
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(workspace);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                // skip moving window if in full screen mode
                if (workspace.stage.fullScreen && workspace.stage.fullScreen.artboardId === item.$id) {
                    return [3 /*break*/, 5];
                }
                bounds = state_1.getWorkspaceItemBounds(item, workspace);
                return [4 /*yield*/, effects_1.put(aerial_common2_1.stoppedMoving(item.$id, item.$type, workspace.targetCSSSelectors))];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
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
function handleNextWindowPressed() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.NEXT_ARTBOARD_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.call(shiftSelectedArtboard, 1)];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function handlePrevWindowPressed() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.PREV_ARTBOARD_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.call(shiftSelectedArtboard, -1)];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function shiftSelectedArtboard(indexDelta) {
    var state, workspace, artboard, index, change, newIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                artboard = state_1.getWorkspaceLastSelectionOwnerArtboard(state, state.selectedWorkspaceId) || workspace.artboards[workspace.artboards.length - 1];
                if (!artboard) {
                    return [2 /*return*/];
                }
                index = workspace.artboards.indexOf(artboard);
                change = index + indexDelta;
                newIndex = change < 0 ? workspace.artboards.length - 1 : change >= workspace.artboards.length ? 0 : change;
                return [4 /*yield*/, effects_1.put(actions_1.artboardSelectionShifted(workspace.artboards[newIndex].$id))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleComponentsPaneEvents() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleComponentsPaneAddClicked)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.spawn(handleDeleteComponentsPane)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleComponentsPaneAddClicked() {
    var name_1, state, workspace, componentId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.COMPONENTS_PANE_ADD_COMPONENT_CLICKED)];
            case 1:
                _a.sent();
                name_1 = prompt("Unique component name");
                if (!name_1) {
                    return [3 /*break*/, 0];
                }
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getWorkspaceById(state, state.selectedWorkspaceId);
                return [4 /*yield*/, effects_1.call(utils_1.apiCreateComponent, name_1, state)];
            case 3:
                componentId = (_a.sent()).componentId;
                console.error("TODO");
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleDeleteComponentsPane() {
    var state, workspace, componentRefs, _i, componentRefs_1, _a, type, componentId, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!true) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.DELETE_SHORCUT_PRESSED)];
            case 1:
                _b.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getWorkspaceById(state, state.selectedWorkspaceId);
                componentRefs = workspace.selectionRefs.filter(function (ref) { return ref[0] === state_1.AVAILABLE_COMPONENT; });
                if (!(componentRefs.length && confirm("Are you sure you want to delete these components?"))) return [3 /*break*/, 6];
                _i = 0, componentRefs_1 = componentRefs;
                _b.label = 3;
            case 3:
                if (!(_i < componentRefs_1.length)) return [3 /*break*/, 6];
                _a = componentRefs_1[_i], type = _a[0], componentId = _a[1];
                return [4 /*yield*/, effects_1.call(utils_1.apiDeleteComponent, componentId, state)];
            case 4:
                result = _b.sent();
                if (result.message) {
                    alert(result.message);
                }
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}
function handleStageContainerResize() {
    var state, workspace, _a, width, height;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!1) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take([actions_1.LOADED_SAVED_STATE, actions_1.WINDOW_RESIZED])];
            case 1:
                _b.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                if (!workspace.stage.container) {
                    return [3 /*break*/, 0];
                }
                _a = workspace.stage.container.getBoundingClientRect(), width = _a.width, height = _a.height;
                return [4 /*yield*/, effects_1.put(actions_1.stageResized(width, height))];
            case 3:
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=workspace.js.map