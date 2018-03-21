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

/***/ "./src/front-end/sagas/synthetic-browser.ts":
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
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var redux_saga_1 = __webpack_require__("./node_modules/redux-saga/es/index.js");
var mesh_1 = __webpack_require__("./node_modules/mesh/index.js");
var utils_1 = __webpack_require__("./src/front-end/utils/index.ts");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
function frontEndSyntheticBrowserSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleTextEditBlur)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleWindowMousePanned)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleFullScreenWindow)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleScrollInFullScreenMode)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleTextEditorEscaped)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleEmptyWindowsUrlAdded)];
            case 6:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleLoadedSavedState)];
            case 7:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleCSSDeclarationChanges)];
            case 8:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleWatchWindowResource)];
            case 9:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleFileChanged)];
            case 10:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenExternalWindowsRequested)];
            case 11:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.frontEndSyntheticBrowserSaga = frontEndSyntheticBrowserSaga;
function handleEmptyWindowsUrlAdded() {
    var url, state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.EMPTY_WINDOWS_URL_ADDED)];
            case 1:
                url = (_a.sent()).url;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: url }, state_1.getSelectedWorkspace(state).browserId))];
            case 3:
                _a.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleWatchWindowResource() {
    var watchingUris, _loop_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                watchingUris = [];
                _loop_1 = function () {
                    var action, state, allUris, updates;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.take([
                                    aerial_browser_sandbox_1.SYNTHETIC_WINDOW_CHANGED,
                                    aerial_browser_sandbox_1.SYNTHETIC_WINDOW_LOADED,
                                    aerial_browser_sandbox_1.SYNTHETIC_WINDOW_CLOSED,
                                    aerial_common2_1.REMOVED
                                ])];
                            case 1:
                                action = _a.sent();
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _a.sent();
                                allUris = lodash_1.uniq(state.browserStore.records.reduce(function (a, b) {
                                    return a.concat(b.windows.reduce(function (a2, b2) {
                                        return a2.concat(b2.externalResourceUris);
                                    }, []));
                                }, []));
                                updates = source_mutation_1.diffArray(allUris, watchingUris, function (a, b) { return a === b ? 0 : -1; }).mutations.filter(function (mutation) { return mutation.type === source_mutation_1.ARRAY_UPDATE; });
                                // no changes, so just continue
                                if (updates.length === allUris.length) {
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, effects_1.spawn(function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, effects_1.call(utils_1.apiWatchUris, watchingUris = allUris, state)];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    })];
                            case 3:
                                _a.sent();
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
function handleTextEditorEscaped() {
    var _a, sourceEvent, nodeId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_EDIT_TEXT_KEY_DOWN)];
            case 1:
                _a = (_b.sent()), sourceEvent = _a.sourceEvent, nodeId = _a.nodeId;
                if (sourceEvent.key !== "Escape") {
                    return [3 /*break*/, 0];
                }
                return [4 /*yield*/, effects_1.call(applyTextEditChanges, sourceEvent, nodeId)];
            case 2:
                _b.sent();
                // blur does _not_ get fired on escape.
                return [4 /*yield*/, effects_1.call(nodeValueStoppedEditing, nodeId)];
            case 3:
                // blur does _not_ get fired on escape.
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function applyTextEditChanges(sourceEvent, nodeId) {
    var state, window, text, workspace;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                window = aerial_browser_sandbox_1.getSyntheticNodeWindow(state, nodeId);
                text = String(sourceEvent.target.textContent || "").trim();
                workspace = state_1.getSyntheticNodeWorkspace(state, nodeId);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.syntheticNodeTextContentChanged(window.$id, nodeId, text))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleTextEditBlur() {
    var _a, sourceEvent, nodeId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_EDIT_TEXT_BLUR)];
            case 1:
                _a = (_b.sent()), sourceEvent = _a.sourceEvent, nodeId = _a.nodeId;
                return [4 /*yield*/, effects_1.call(applyTextEditChanges, sourceEvent, nodeId)];
            case 2:
                _b.sent();
                return [4 /*yield*/, effects_1.call(nodeValueStoppedEditing, nodeId)];
            case 3:
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function nodeValueStoppedEditing(nodeId) {
    var state, window;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                window = aerial_browser_sandbox_1.getSyntheticNodeWindow(state, nodeId);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.syntheticNodeValueStoppedEditing(window.$id, nodeId))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
var MOMENTUM_THRESHOLD = 100;
var DEFAULT_MOMENTUM_DAMP = 0.1;
var MOMENTUM_DELAY = 50;
var VELOCITY_MULTIPLIER = 10;
function handleScrollInFullScreenMode() {
    var _a, deltaX, deltaY, state, workspace, window_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.VISUAL_EDITOR_WHEEL)];
            case 1:
                _a = (_b.sent()), deltaX = _a.deltaX, deltaY = _a.deltaY;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = (_b.sent());
                workspace = state_1.getSelectedWorkspace(state);
                if (!workspace.stage.fullScreen) {
                    return [3 /*break*/, 0];
                }
                window_1 = state_1.getSyntheticWindow(state, workspace.stage.fullScreen.windowId);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.syntheticWindowScroll(window_1.$id, aerial_common2_1.shiftPoint(window_1.scrollPosition || { left: 0, top: 0 }, {
                        left: 0,
                        top: deltaY
                    })))];
            case 3:
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleFileChanged() {
    var _loop_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_2 = function () {
                    var _a, filePath, publicPath, state, workspace, windows, _i, windows_1, window_2, shouldReload;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, effects_1.take([actions_1.FILE_CONTENT_CHANGED, actions_1.FILE_REMOVED])];
                            case 1:
                                _a = _b.sent(), filePath = _a.filePath, publicPath = _a.publicPath;
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _b.sent();
                                workspace = state_1.getSelectedWorkspace(state);
                                windows = state_1.getSyntheticBrowser(state, workspace.browserId).windows;
                                for (_i = 0, windows_1 = windows; _i < windows_1.length; _i++) {
                                    window_2 = windows_1[_i];
                                    shouldReload = window_2.externalResourceUris.find(function (uri) { return ((publicPath && uri.indexOf(publicPath) !== -1) || uri.indexOf(filePath) !== -1); });
                                    if (shouldReload) {
                                        window_2.instance.location.reload();
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (false) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_2()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function handleOpenExternalWindowsRequested() {
    var uris, state, workspace, browser, _loop_3, _i, uris_1, uri;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("WAY");
                _a.label = 1;
            case 1:
                if (false) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_EXTERNAL_WINDOWS_REQUESTED)];
            case 2:
                uris = (_a.sent()).uris;
                return [4 /*yield*/, effects_1.select()];
            case 3:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                browser = state_1.getSyntheticBrowser(state, workspace.browserId);
                _loop_3 = function (uri) {
                    var existingWindow;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                existingWindow = browser.windows.find(function (window) { return window.location === uri; });
                                if (existingWindow) {
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({
                                        location: uri
                                    }, browser.$id))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, uris_1 = uris;
                _a.label = 4;
            case 4:
                if (!(_i < uris_1.length)) return [3 /*break*/, 7];
                uri = uris_1[_i];
                return [5 /*yield**/, _loop_3(uri)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [3 /*break*/, 1];
            case 8: return [2 /*return*/];
        }
    });
}
function handleLoadedSavedState() {
    var state, workspace, browser, _i, _a, window_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.LOADED_SAVED_STATE)];
            case 1:
                _b.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                browser = state_1.getSyntheticBrowser(state, workspace.browserId);
                _i = 0, _a = browser.windows;
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                window_3 = _a[_i];
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest(window_3, browser.$id))];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}
function persistDeclarationChange(declaration, name, value) {
    var owner, element, mutation, mutation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                owner = declaration.$owner;
                if (!(owner.nodeType === aerial_browser_sandbox_1.SEnvNodeTypes.ELEMENT)) return [3 /*break*/, 2];
                element = owner;
                mutation = aerial_browser_sandbox_1.createSetElementAttributeMutation(element, "style", element.getAttribute("style"));
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.deferApplyFileMutationsRequest(mutation))];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                mutation = aerial_browser_sandbox_1.cssStyleDeclarationSetProperty(declaration, name, value);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.deferApplyFileMutationsRequest(mutation))];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}
// TODO - move this to synthetic browser
function handleCSSDeclarationChanges() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(function handleNameChanges() {
                    var _a, value, windowId, declarationId, state, window_4;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (false) return [3 /*break*/, 3];
                                return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_NAME_CHANGED)];
                            case 1:
                                _a = _b.sent(), value = _a.value, windowId = _a.windowId, declarationId = _a.declarationId;
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _b.sent();
                                window_4 = state_1.getSyntheticWindow(state, windowId);
                                return [3 /*break*/, 0];
                            case 3: return [2 /*return*/];
                        }
                    });
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleValueChanges() {
                        var _a, name_1, value, windowId, declarationId, state, window_5, declaration;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_VALUE_CHANGED)];
                                case 1:
                                    _a = _b.sent(), name_1 = _a.name, value = _a.value, windowId = _a.windowId, declarationId = _a.declarationId;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _b.sent();
                                    window_5 = state_1.getSyntheticWindow(state, windowId);
                                    declaration = aerial_browser_sandbox_1.getSyntheticWindowChild(window_5, declarationId).instance;
                                    declaration;
                                    // null or ""
                                    if (!value) {
                                        declaration.removeProperty(name_1);
                                    }
                                    else {
                                        declaration.setProperty(name_1, value);
                                    }
                                    return [4 /*yield*/, effects_1.call(persistDeclarationChange, declaration, name_1, value)];
                                case 3:
                                    _b.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleNewDeclaration() {
                        var _a, name_2, value, windowId, declarationId, state, window_6, declaration;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_CREATED)];
                                case 1:
                                    _a = _b.sent(), name_2 = _a.name, value = _a.value, windowId = _a.windowId, declarationId = _a.declarationId;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _b.sent();
                                    window_6 = state_1.getSyntheticWindow(state, windowId);
                                    declaration = aerial_browser_sandbox_1.getSyntheticWindowChild(window_6, declarationId).instance;
                                    declaration.setProperty(name_2, value);
                                    return [4 /*yield*/, effects_1.call(persistDeclarationChange, declaration, name_2, value)];
                                case 3:
                                    _b.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
// fugly quick momentum scrolling implementation
function handleWindowMousePanned() {
    function scrollDelta(windowId, deltaY) {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.syntheticWindowScroll(windowId, aerial_common2_1.shiftPoint(panStartScrollPosition, {
                        left: 0,
                        top: -deltaY
                    })))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }
    var deltaTop, deltaLeft, currentWindowId, panStartScrollPosition, lastPaneEvent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deltaTop = 0;
                deltaLeft = 0;
                return [4 /*yield*/, effects_1.fork(function () {
                        var windowId, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 3];
                                    return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_START)];
                                case 1:
                                    windowId = (_b.sent()).windowId;
                                    _a = state_1.getSyntheticWindow;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    panStartScrollPosition = _a.apply(void 0, [_b.sent(), windowId]).scrollPosition || { left: 0, top: 0 };
                                    return [3 /*break*/, 0];
                                case 3: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function () {
                        var event_1, windowId, deltaY, center, newVelocityY, zoom, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PANNING)];
                                case 1:
                                    event_1 = lastPaneEvent = (_c.sent());
                                    windowId = event_1.windowId, deltaY = event_1.deltaY, center = event_1.center, newVelocityY = event_1.velocityY;
                                    _a = state_1.getStageTranslate;
                                    _b = state_1.getSelectedWorkspace;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    zoom = _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).stage]).zoom;
                                    return [4 /*yield*/, scrollDelta(windowId, deltaY / zoom)];
                                case 3:
                                    _c.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function () {
                        var _loop_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _loop_4 = function () {
                                        var windowId, deltaY, velocityY, zoom, _a, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0: return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_END)];
                                                case 1:
                                                    _c.sent();
                                                    windowId = lastPaneEvent.windowId, deltaY = lastPaneEvent.deltaY, velocityY = lastPaneEvent.velocityY;
                                                    _a = state_1.getStageTranslate;
                                                    _b = state_1.getSelectedWorkspace;
                                                    return [4 /*yield*/, effects_1.select()];
                                                case 2:
                                                    zoom = _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).stage]).zoom;
                                                    return [4 /*yield*/, spring(deltaY, velocityY * VELOCITY_MULTIPLIER, function (deltaY) {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, scrollDelta(windowId, deltaY / zoom)];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        })];
                                                case 3:
                                                    _c.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a.label = 1;
                                case 1:
                                    if (false) return [3 /*break*/, 3];
                                    return [5 /*yield**/, _loop_4()];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 1];
                                case 3: return [2 /*return*/];
                            }
                        });
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
var WINDOW_SYNC_MS = 1000 / 30;
function handleFullScreenWindow() {
    var currentFullScreenWindowId, previousWindowBounds, waitForFullScreenMode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                waitForFullScreenMode = mesh_1.createDeferredPromise();
                return [4 /*yield*/, effects_1.fork(function () {
                        var state, workspace, windowId, window_7;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 5];
                                    // TODO - possibly change to WINDOW_SCOPE_CHANGED
                                    return [4 /*yield*/, effects_1.take([actions_1.FULL_SCREEN_SHORTCUT_PRESSED, aerial_browser_sandbox_1.SYNTHETIC_WINDOW_PROXY_OPENED, actions_1.WINDOW_SELECTION_SHIFTED, actions_1.FULL_SCREEN_TARGET_DELETED])];
                                case 1:
                                    // TODO - possibly change to WINDOW_SCOPE_CHANGED
                                    _a.sent();
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _a.sent();
                                    workspace = state_1.getSelectedWorkspace(state);
                                    windowId = workspace.stage.fullScreen && workspace.stage.fullScreen.windowId;
                                    if (!currentFullScreenWindowId) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.put(aerial_common2_1.resized(currentFullScreenWindowId, aerial_browser_sandbox_1.SYNTHETIC_WINDOW, previousWindowBounds))];
                                case 3:
                                    _a.sent();
                                    previousWindowBounds = undefined;
                                    currentFullScreenWindowId = undefined;
                                    // TODO - revert window size
                                    waitForFullScreenMode = mesh_1.createDeferredPromise();
                                    _a.label = 4;
                                case 4:
                                    if (windowId) {
                                        window_7 = state_1.getSyntheticWindow(state, windowId);
                                        previousWindowBounds = workspace.stage.fullScreen.originalWindowBounds;
                                        waitForFullScreenMode.resolve(true);
                                    }
                                    currentFullScreenWindowId = windowId;
                                    return [3 /*break*/, 0];
                                case 5: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function syncFullScreenWindowSize() {
                        var state, workspace, container, rect, window_8;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 5];
                                    return [4 /*yield*/, effects_1.call(function () { return waitForFullScreenMode.promise; })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _a.sent();
                                    workspace = state_1.getSelectedWorkspace(state);
                                    container = workspace.stage.container;
                                    rect = container.getBoundingClientRect();
                                    window_8 = state_1.getSyntheticWindow(state, currentFullScreenWindowId);
                                    return [4 /*yield*/, effects_1.put(aerial_common2_1.resized(currentFullScreenWindowId, aerial_browser_sandbox_1.SYNTHETIC_WINDOW, {
                                            left: window_8.bounds.left,
                                            top: window_8.bounds.top,
                                            right: window_8.bounds.left + rect.width,
                                            bottom: window_8.bounds.top + rect.height,
                                        }))];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, effects_1.call(function () { return new Promise(function (resolve) { return setTimeout(resolve, WINDOW_SYNC_MS); }); })];
                                case 4:
                                    _a.sent();
                                    return [3 /*break*/, 0];
                                case 5: return [2 /*return*/];
                            }
                        });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function spring(start, velocityY, iterate, damp, complete) {
    if (damp === void 0) { damp = DEFAULT_MOMENTUM_DAMP; }
    if (complete === void 0) { complete = function () { }; }
    function tick() {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i += damp;
                    currentValue += velocityY / (i / 1);
                    if (i >= 1) {
                        return [2 /*return*/, complete()];
                    }
                    return [4 /*yield*/, iterate(currentValue)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, effects_1.call(redux_saga_1.delay, MOMENTUM_DELAY)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tick()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }
    var i, v, currentValue;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                v = velocityY;
                currentValue = start;
                return [4 /*yield*/, tick()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/synthetic-browser.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/synthetic-browser.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})