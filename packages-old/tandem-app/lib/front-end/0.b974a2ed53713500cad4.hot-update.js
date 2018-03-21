webpackHotUpdate(0,{

/***/ "./src/front-end/sagas/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var shortcuts_1 = __webpack_require__("./src/front-end/sagas/shortcuts.ts");
var workspace_1 = __webpack_require__("./src/front-end/sagas/workspace.ts");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var synthetic_browser_1 = __webpack_require__("./src/front-end/sagas/synthetic-browser.ts");
var api_1 = __webpack_require__("./src/front-end/sagas/api.ts");
function mainSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(aerial_browser_sandbox_1.syntheticBrowserSaga)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(workspace_1.mainWorkspaceSaga)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(shortcuts_1.shortcutsService)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(synthetic_browser_1.frontEndSyntheticBrowserSaga)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(api_1.apiSaga)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.mainSaga = mainSaga;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/sagas/workspace.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var utils_1 = __webpack_require__("./src/front-end/utils/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var WINDOW_PADDING = 10;
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
// import { deleteShortcutPressed, , apiComponentsLoaded } from "front-end";
function mainWorkspaceSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(openDefaultWindow)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleAltClickElement)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleMetaClickElement)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleMetaClickComponentCell)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleDeleteKeyPressed)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleNextWindowPressed)];
            case 6:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handlePrevWindowPressed)];
            case 7:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionMoved)];
            case 8:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionStoppedMoving)];
            case 9:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionKeyDown)];
            case 10:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionKeyUp)];
            case 11:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionResized)];
            case 12:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleNewLocationPrompt)];
            case 13:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenNewWindowShortcut)];
            case 14:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleCloneSelectedWindowShortcut)];
            case 15:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSourceClicked)];
            case 16:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenExternalWindowButtonClicked)];
            case 17:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleDNDEnded)];
            case 18:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleComponentsPaneEvents)];
            case 19:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(syncWindowsWithAvailableComponents)];
            case 20:
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
    var windowId, syntheticWindow, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED)];
            case 1:
                windowId = (_b.sent()).windowId;
                _a = aerial_browser_sandbox_1.getSyntheticWindow;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                syntheticWindow = _a.apply(void 0, [_b.sent(), windowId]);
                window.open(syntheticWindow.location, "_blank");
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function handleAltClickElement() {
    var event_1, state, targetRef, workspace, node, element, href, window_1, browserBounds, workspace_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.STAGE_MOUSE_CLICKED && action.sourceEvent.altKey; })];
            case 1:
                event_1 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                targetRef = state_1.getStageToolMouseNodeTargetReference(state, event_1);
                workspace = state_1.getSelectedWorkspace(state);
                if (!targetRef)
                    return [3 /*break*/, 0];
                node = aerial_browser_sandbox_1.getSyntheticNodeById(state, targetRef[1]);
                if (!(node.nodeType === aerial_browser_sandbox_1.SEnvNodeTypes.ELEMENT)) return [3 /*break*/, 4];
                element = node;
                if (!(element.nodeName === "A")) return [3 /*break*/, 4];
                href = element.attributes.find(function (a) { return a.name === "href"; });
                if (!href) return [3 /*break*/, 4];
                window_1 = aerial_browser_sandbox_1.getSyntheticNodeWindow(state, node.$id);
                browserBounds = aerial_browser_sandbox_1.getSyntheticBrowserBounds(aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, window_1.$id));
                workspace_1 = state_1.getSyntheticWindowWorkspace(state, window_1.$id);
                return [4 /*yield*/, openNewWindow(state, href.value, window_1, workspace_1)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
function handleMetaClickElement() {
    var event_2, state, targetRef, workspace, node;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.STAGE_MOUSE_CLICKED && action.sourceEvent.metaKey; })];
            case 1:
                event_2 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                targetRef = state_1.getStageToolMouseNodeTargetReference(state, event_2);
                workspace = state_1.getSelectedWorkspace(state);
                // not items should be selected for meta clicks
                // if (workspace.selectionRefs.length) {
                //   continue;
                // }
                if (!targetRef)
                    return [3 /*break*/, 0];
                node = aerial_browser_sandbox_1.getSyntheticNodeById(state, targetRef[1]);
                if (!(node.source && node.source.uri)) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, node.source, state)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                if (!node.source) {
                    console.warn("source URI does not exist on selected node.");
                }
                _a.label = 5;
            case 5: return [3 /*break*/, 0];
            case 6: return [2 /*return*/];
        }
    });
}
function handleMetaClickComponentCell() {
    var _a, componentId, sourceEvent, state, workspace, component;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
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
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, __assign({ uri: component.filePath }, component.location), state)];
            case 3:
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function openNewWindow(state, href, origin, workspace) {
    var uri, windowBounds, browserBounds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uri = aerial_browser_sandbox_1.getUri(href, origin.location);
                windowBounds = workspace.stage.fullScreen ? workspace.stage.fullScreen.originalWindowBounds : origin.bounds;
                browserBounds = aerial_browser_sandbox_1.getSyntheticBrowserBounds(aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, origin.$id));
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: uri, bounds: {
                            left: Math.max(browserBounds.right, windowBounds.right) + WINDOW_PADDING,
                            top: 0,
                            right: undefined,
                            bottom: undefined
                        } }, workspace.browserId))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleDeleteKeyPressed() {
    var action, state, sourceEvent, workspace, _i, _a, _b, type, id;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 9];
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
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                _b = _a[_i], type = _b[0], id = _b[1];
                return [4 /*yield*/, effects_1.put(aerial_common2_1.removed(id, type))];
            case 4:
                _c.sent();
                if (!(workspace.stage.fullScreen && workspace.stage.fullScreen.windowId === id)) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.put(actions_1.fullScreenTargetDeleted())];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7: return [4 /*yield*/, effects_1.put(actions_1.workspaceSelectionDeleted(workspace.$id))];
            case 8:
                _c.sent();
                return [3 /*break*/, 0];
            case 9: return [2 /*return*/];
        }
    });
}
function handleSelectionMoved() {
    var _a, point, workspaceId, newPoint, state, workspace, translate, selectionBounds, _i, _b, item, itemBounds;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.RESIZER_MOVED)];
            case 1:
                _a = (_c.sent()), point = _a.point, workspaceId = _a.workspaceId, newPoint = _a.point;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = (_c.sent());
                workspace = state_1.getWorkspaceById(state, workspaceId);
                translate = state_1.getStageTranslate(workspace.stage);
                selectionBounds = state_1.getWorkspaceSelectionBounds(state, workspace);
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(state, workspace);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                itemBounds = state_1.getSyntheticBrowserItemBounds(state, item);
                // skip moving window if in full screen mode
                if (workspace.stage.fullScreen && workspace.stage.fullScreen.windowId === item.$id) {
                    return [3 /*break*/, 5];
                }
                return [4 /*yield*/, effects_1.put(aerial_common2_1.moved(item.$id, item.$type, aerial_common2_1.scaleInnerBounds(itemBounds, selectionBounds, aerial_common2_1.moveBounds(selectionBounds, newPoint)), workspace.targetCSSSelectors))];
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
function handleDNDEnded() {
    var event_3, state, workspace, dropRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.take(actions_1.DND_ENDED)];
            case 1:
                event_3 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                dropRef = state_1.getStageToolMouseNodeTargetReference(state, event_3);
                if (!dropRef) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.call(handleDroppedOnElement, dropRef, event_3)];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, effects_1.call(handleDroppedOnEmptySpace, event_3)];
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
        console.log(ref, event);
        return [2 /*return*/];
    });
}
function handleDroppedOnEmptySpace(event) {
    var _a, pageX, pageY, state, uri, workspace, mousePosition;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = event.sourceEvent, pageX = _a.pageX, pageY = _a.pageY;
                return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                uri = utils_1.apiGetComponentPreviewURI(event.ref[1], state);
                workspace = state_1.getSelectedWorkspace(state);
                mousePosition = state_1.getScaledMouseStagePosition(state, event);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: uri, bounds: __assign({}, mousePosition, { right: undefined, bottom: undefined }) }, workspace.browserId))];
            case 2:
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
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.RESIZER_PATH_MOUSE_MOVED)];
            case 1:
                _a = (_c.sent()), workspaceId = _a.workspaceId, anchor = _a.anchor, originalBounds = _a.originalBounds, newBounds = _a.newBounds, sourceEvent = _a.sourceEvent;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _c.sent();
                workspace = state_1.getWorkspaceById(state, workspaceId);
                currentBounds = state_1.getWorkspaceSelectionBounds(state, workspace);
                keepAspectRatio = sourceEvent.shiftKey;
                keepCenter = sourceEvent.altKey;
                if (keepCenter) {
                    // newBounds = keepBoundsCenter(newBounds, bounds, anchor);
                }
                if (keepAspectRatio) {
                    newBounds = aerial_common2_1.keepBoundsAspectRatio(newBounds, originalBounds, anchor, keepCenter ? { left: 0.5, top: 0.5 } : anchor);
                }
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(state, workspace);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                innerBounds = state_1.getSyntheticBrowserItemBounds(state, item);
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
function handleOpenNewWindowShortcut() {
    var uri, state, workspace;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_NEW_WINDOW_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                uri = prompt("URL");
                if (!uri)
                    return [3 /*break*/, 0];
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: uri }, workspace.browserId))];
            case 3:
                _a.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleCloneSelectedWindowShortcut() {
    var state, workspace, itemRef, window_2, originalWindowBounds, clonedWindow;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.take(actions_1.CLONE_WINDOW_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                itemRef = workspace.selectionRefs[0];
                if (!itemRef)
                    return [3 /*break*/, 0];
                window_2 = itemRef[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW ? aerial_browser_sandbox_1.getSyntheticWindow(state, itemRef[1]) : aerial_browser_sandbox_1.getSyntheticNodeWindow(state, itemRef[1]);
                originalWindowBounds = workspace.stage.fullScreen ? workspace.stage.fullScreen.originalWindowBounds : window_2.bounds;
                return [4 /*yield*/, aerial_common2_1.request(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: window_2.location, bounds: aerial_common2_1.moveBounds(originalWindowBounds, {
                            left: originalWindowBounds.left,
                            top: originalWindowBounds.bottom + WINDOW_PADDING
                        }) }, aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, window_2.$id).$id))];
            case 3: return [4 /*yield*/, _a.sent()];
            case 4:
                clonedWindow = _a.sent();
                return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
function handleNewLocationPrompt() {
    var _a, workspaceId, location_1, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.PROMPTED_NEW_WINDOW_URL)];
            case 1:
                _a = (_f.sent()), workspaceId = _a.workspaceId, location_1 = _a.location;
                _b = effects_1.put;
                _c = aerial_browser_sandbox_1.openSyntheticWindowRequest;
                _d = [{ location: location_1 }];
                _e = state_1.getWorkspaceById;
                return [4 /*yield*/, effects_1.select()];
            case 2: return [4 /*yield*/, _b.apply(void 0, [_c.apply(void 0, _d.concat([_e.apply(void 0, [_f.sent(), workspaceId]).browserId]))])];
            case 3:
                _f.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleSelectionKeyDown() {
    var type, state, workspace, workspaceId, bounds, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 12];
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
                bounds = state_1.getWorkspaceSelectionBounds(state, workspace);
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
                if (false) return [3 /*break*/, 4];
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
    var _a, itemId, windowId, state, item;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.take(actions_1.SOURCE_CLICKED)];
            case 1:
                _a = (_b.sent()), itemId = _a.itemId, windowId = _a.windowId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                item = aerial_browser_sandbox_1.getSyntheticNodeById(state, itemId);
                if (!(item.source && item.source.uri)) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, item.source, state)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4: return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
function handleSelectionStoppedMoving() {
    var _a, point, workspaceId, state, workspace, _i, _b, item, bounds;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.RESIZER_STOPPED_MOVING)];
            case 1:
                _a = (_c.sent()), point = _a.point, workspaceId = _a.workspaceId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = (_c.sent());
                workspace = state_1.getWorkspaceById(state, workspaceId);
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(state, workspace);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                // skip moving window if in full screen mode
                if (workspace.stage.fullScreen && workspace.stage.fullScreen.windowId === item.$id) {
                    return [3 /*break*/, 5];
                }
                bounds = state_1.getSyntheticBrowserItemBounds(state, item);
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
function syncWindowsWithAvailableComponents() {
    var _loop_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_1 = function () {
                    var state, workspace, availableComponentUris, browser, windowUris, deletes, _i, deletes_1, index, window_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.API_COMPONENTS_LOADED)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _a.sent();
                                workspace = state_1.getWorkspaceById(state, state.selectedWorkspaceId);
                                availableComponentUris = workspace.availableComponents.map(function (component) { return utils_1.apiGetComponentPreviewURI(component.$id, state); });
                                browser = aerial_browser_sandbox_1.getSyntheticBrowser(state, workspace.browserId);
                                windowUris = browser.windows.map(function (window) { return window.location; });
                                deletes = source_mutation_1.diffArray(windowUris, availableComponentUris, function (a, b) { return a === b ? 0 : -1; }).mutations.filter(function (mutation) { return mutation.type === source_mutation_1.ARRAY_DELETE; });
                                for (_i = 0, deletes_1 = deletes; _i < deletes_1.length; _i++) {
                                    index = deletes_1[_i].index;
                                    window_3 = browser.windows[index];
                                    window_3.instance.close();
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (false) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_1()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function handleNextWindowPressed() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.NEXT_WINDOW_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.call(shiftSelectedWindow, 1)];
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
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.PREV_WINDOW_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.call(shiftSelectedWindow, -1)];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function shiftSelectedWindow(indexDelta) {
    var state, window, browser, index, change, newIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                window = state_1.getWorkspaceLastSelectionOwnerWindow(state, state.selectedWorkspaceId) || state_1.getWorkspaceWindow(state, state.selectedWorkspaceId);
                if (!window) {
                    return [2 /*return*/];
                }
                browser = aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, window.$id);
                index = browser.windows.indexOf(window);
                change = index + indexDelta;
                newIndex = change < 0 ? browser.windows.length - 1 : change >= browser.windows.length ? 0 : change;
                return [4 /*yield*/, effects_1.put(actions_1.windowSelectionShifted(browser.windows[newIndex].$id))];
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
                if (false) return [3 /*break*/, 5];
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
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: utils_1.apiGetComponentPreviewURI(componentId, state) }, workspace.browserId))];
            case 4:
                _a.sent();
                return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
function handleDeleteComponentsPane() {
    var state, workspace, componentRefs, _i, componentRefs_1, _a, type, componentId, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
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


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/workspace.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/workspace.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})