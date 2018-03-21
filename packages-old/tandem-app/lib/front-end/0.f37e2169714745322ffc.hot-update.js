webpackHotUpdate(0,{

/***/ "./src/front-end/sagas/artboard.ts":
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
var slim_dom_1 = __webpack_require__("../slim-dom/index.js");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var redux_saga_1 = __webpack_require__("./node_modules/redux-saga/es/index.js");
var aerial_common2_2 = __webpack_require__("../aerial-common2/index.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var utils_1 = __webpack_require__("./src/front-end/utils/index.ts");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var COMPUTE_DOM_INFO_DELAY = 500;
var VELOCITY_MULTIPLIER = 10;
var DEFAULT_MOMENTUM_DAMP = 0.1;
var MOMENTUM_THRESHOLD = 100;
var MOMENTUM_DELAY = 50;
function artboardSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleLoadAllArtboards)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleChangedArtboards)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleCreatedArtboard)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleArtboardRendered)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleMoved)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleResized)];
            case 6:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleScroll)];
            case 7:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSyncScroll)];
            case 8:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleArtboardSizeChanges)];
            case 9:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenExternalArtboardsRequested)];
            case 10:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.artboardSaga = artboardSaga;
function handleLoadAllArtboards() {
    var state, workspace, _loop_1, _i, _a, artboard;
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
                _loop_1 = function (artboard) {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.spawn(function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, effects_1.call(reloadArtboard, artboard.$id)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = workspace.artboards;
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                artboard = _a[_i];
                return [5 /*yield**/, _loop_1(artboard)];
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
function handleChangedArtboards() {
    var _a, filePath, publicPath, state, workspace, _i, _b, artboard;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.FILE_CONTENT_CHANGED)];
            case 1:
                _a = _c.sent(), filePath = _a.filePath, publicPath = _a.publicPath;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _c.sent();
                workspace = state_1.getSelectedWorkspace(state);
                _i = 0, _b = workspace.artboards;
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                artboard = _b[_i];
                if (!(artboard.dependencyUris.indexOf(filePath) !== -1)) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.call(patchArtboard, artboard.$id)];
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
function handleArtboardRendered() {
    var _loop_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_2 = function () {
                    var artboardId;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.ARTBOARD_RENDERED)];
                            case 1:
                                artboardId = (_a.sent()).artboardId;
                                return [4 /*yield*/, effects_1.fork(function () {
                                        var artboard, _a, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    _a = state_1.getArtboardById;
                                                    _b = [artboardId];
                                                    return [4 /*yield*/, effects_1.select()];
                                                case 1:
                                                    artboard = _a.apply(void 0, _b.concat([_c.sent()]));
                                                    // delay for a bit to ensure that the DOM nodes are painted. This is a dumb quick fix that may be racy sometimes. 
                                                    return [4 /*yield*/, effects_1.call(redux_saga_1.delay, COMPUTE_DOM_INFO_DELAY)];
                                                case 2:
                                                    // delay for a bit to ensure that the DOM nodes are painted. This is a dumb quick fix that may be racy sometimes. 
                                                    _c.sent();
                                                    return [4 /*yield*/, effects_1.call(recomputeArtboardInfo, artboard)];
                                                case 3:
                                                    _c.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    })];
                            case 2:
                                _a.sent();
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
var RESIZE_TIMEOUT = 10;
function handleArtboardSizeChanges() {
    var _loop_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_3 = function () {
                    var artboardId, artboard, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.ARTBOARD_RENDERED)];
                            case 1:
                                artboardId = (_c.sent()).artboardId;
                                _a = state_1.getArtboardById;
                                _b = [artboardId];
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                artboard = _a.apply(void 0, _b.concat([_c.sent()]));
                                return [4 /*yield*/, effects_1.fork(function () {
                                        var resizeChan;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    resizeChan = redux_saga_1.eventChannel(function (emit) {
                                                        artboard.mount.contentWindow.addEventListener("resize", lodash_1.debounce(emit, RESIZE_TIMEOUT));
                                                        return function () { };
                                                    });
                                                    _a.label = 1;
                                                case 1:
                                                    if (false) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, effects_1.take(resizeChan)];
                                                case 2:
                                                    _a.sent();
                                                    return [4 /*yield*/, effects_1.call(recomputeArtboardInfo, artboard)];
                                                case 3:
                                                    _a.sent();
                                                    return [3 /*break*/, 1];
                                                case 4: return [2 /*return*/];
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
                return [5 /*yield**/, _loop_3()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function recomputeArtboardInfo(artboard) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.put(actions_1.artboardDOMComputedInfo(artboard.$id, slim_dom_1.computedDOMInfo(artboard.nativeNodeMap)))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function reloadArtboard(artboardId) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.spawn(function () {
                    var state, artboard, _a, dependencyUris, compressedNode, doc, mount, renderChan;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, effects_1.select()];
                            case 1:
                                state = _b.sent();
                                artboard = state_1.getArtboardById(artboardId, state);
                                return [4 /*yield*/, effects_1.call(utils_1.getComponentPreview, artboard.componentId, artboard.previewName, state)];
                            case 2:
                                _a = _b.sent(), dependencyUris = _a[0], compressedNode = _a[1];
                                doc = slim_dom_1.uncompressRootNode([dependencyUris, compressedNode]);
                                mount = document.createElement("iframe");
                                mount.setAttribute("style", "border: none; width: 100%; height: 100%");
                                renderChan = redux_saga_1.eventChannel(function (emit) {
                                    mount.addEventListener("load", function () {
                                        emit(slim_dom_1.renderDOM(doc, mount.contentDocument.body));
                                    });
                                    return function () { };
                                });
                                return [4 /*yield*/, effects_1.spawn(function () {
                                        var _a, _b, _c;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    _a = effects_1.put;
                                                    _b = actions_1.artboardRendered;
                                                    _c = [artboardId];
                                                    return [4 /*yield*/, effects_1.take(renderChan)];
                                                case 1: return [4 /*yield*/, _a.apply(void 0, [_b.apply(void 0, _c.concat([_d.sent()]))])];
                                                case 2:
                                                    _d.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, effects_1.put(actions_1.artboardLoaded(artboard.$id, dependencyUris, doc, mount))];
                            case 4:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function patchArtboard(artboardId) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.spawn(function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleCreatedArtboard() {
    var artboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.ARTBOARD_CREATED)];
            case 1:
                artboard = (_a.sent()).artboard;
                return [4 /*yield*/, effects_1.call(reloadArtboard, artboard.$id)];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function handleMoved() {
    var point;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 2];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === aerial_common2_2.MOVED && action.itemType === state_1.ARTBOARD; })];
            case 1:
                point = (_a.sent()).point;
                return [3 /*break*/, 0];
            case 2: return [2 /*return*/];
        }
    });
}
function handleResized() {
    var bounds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.take(function (action) { return action.type === aerial_common2_2.RESIZED && action.itemType === state_1.ARTBOARD; })];
            case 1:
                bounds = (_a.sent()).bounds;
                return [2 /*return*/];
        }
    });
}
function handleScroll() {
    function scrollDelta(windowId, deltaY) {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.put(actions_1.artboardScroll(windowId, aerial_common2_1.shiftPoint(panStartScrollPosition, {
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
                        var event_1, artboardId, deltaY, center, newVelocityY, zoom, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PANNING)];
                                case 1:
                                    event_1 = lastPaneEvent = (_c.sent());
                                    artboardId = event_1.artboardId, deltaY = event_1.deltaY, center = event_1.center, newVelocityY = event_1.velocityY;
                                    _a = state_1.getStageTranslate;
                                    _b = state_1.getSelectedWorkspace;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    zoom = _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).stage]).zoom;
                                    return [4 /*yield*/, scrollDelta(artboardId, deltaY / zoom)];
                                case 3:
                                    _c.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function () {
                        var _loop_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _loop_4 = function () {
                                        var artboardId, deltaY, velocityY, zoom, _a, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0: return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_END)];
                                                case 1:
                                                    _c.sent();
                                                    artboardId = lastPaneEvent.artboardId, deltaY = lastPaneEvent.deltaY, velocityY = lastPaneEvent.velocityY;
                                                    _a = state_1.getStageTranslate;
                                                    _b = state_1.getSelectedWorkspace;
                                                    return [4 /*yield*/, effects_1.select()];
                                                case 2:
                                                    zoom = _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).stage]).zoom;
                                                    return [4 /*yield*/, spring(deltaY, velocityY * VELOCITY_MULTIPLIER, function (deltaY) {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, scrollDelta(artboardId, deltaY / zoom)];
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
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleSyncScroll() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 2];
                return [4 /*yield*/, effects_1.take([actions_1.STAGE_TOOL_OVERLAY_MOUSE_PANNING])];
            case 1:
                _a.sent();
                return [3 /*break*/, 0];
            case 2: return [2 /*return*/];
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
function handleOpenExternalArtboardsRequested() {
    var artboardInfo, state, workspace, lastExistingArtboard, _loop_5, _i, artboardInfo_1, _a, componentId, previewName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_ARTBOARDS_REQUESTED)];
            case 1:
                artboardInfo = (_b.sent()).artboardInfo;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                lastExistingArtboard = void 0;
                _loop_5 = function (componentId, previewName) {
                    var existingArtboard;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                existingArtboard = workspace.artboards.find(function (artboard) { return artboard.componentId === componentId && (!previewName || artboard.previewName === previewName); });
                                if (existingArtboard) {
                                    lastExistingArtboard = existingArtboard;
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, effects_1.put(actions_1.artboardCreated(lastExistingArtboard = state_1.createArtboard({
                                        componentId: componentId,
                                        previewName: previewName
                                    })))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, artboardInfo_1 = artboardInfo;
                _b.label = 3;
            case 3:
                if (!(_i < artboardInfo_1.length)) return [3 /*break*/, 6];
                _a = artboardInfo_1[_i], componentId = _a[0], previewName = _a[1];
                return [5 /*yield**/, _loop_5(componentId, previewName)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                if (!lastExistingArtboard) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.put(actions_1.artboardFocused(lastExistingArtboard.$id))];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [3 /*break*/, 0];
            case 9: return [2 /*return*/];
        }
    });
}


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/artboard.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/artboard.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

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
var artboard_1 = __webpack_require__("./src/front-end/sagas/artboard.ts");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var window_1 = __webpack_require__("./src/front-end/sagas/window.ts");
var synthetic_browser_1 = __webpack_require__("./src/front-end/sagas/synthetic-browser.ts");
var api_1 = __webpack_require__("./src/front-end/sagas/api.ts");
function mainSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(artboard_1.artboardSaga)];
            case 1:
                _a.sent();
                // TODO - deprecate this
                return [4 /*yield*/, effects_1.fork(aerial_browser_sandbox_1.syntheticBrowserSaga)];
            case 2:
                // TODO - deprecate this
                _a.sent();
                return [4 /*yield*/, effects_1.fork(window_1.windowSaga)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(workspace_1.mainWorkspaceSaga)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(shortcuts_1.shortcutsService)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(synthetic_browser_1.frontEndSyntheticBrowserSaga)];
            case 6:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(api_1.apiSaga)];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.mainSaga = mainSaga;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})