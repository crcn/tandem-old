"use strict";
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
var slim_dom_1 = require("slim-dom");
var effects_1 = require("redux-saga/effects");
var aerial_common2_1 = require("aerial-common2");
var redux_saga_1 = require("redux-saga");
var aerial_common2_2 = require("aerial-common2");
var source_mutation_1 = require("source-mutation");
var actions_1 = require("../actions");
var utils_1 = require("../utils");
var state_1 = require("../state");
var lodash_1 = require("lodash");
var crc32 = require("crc32");
var COMPUTE_DOM_INFO_DELAY = 100;
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
                // yield fork(handleChangedArtboards);
                return [4 /*yield*/, effects_1.fork(handleCreatedArtboard)];
            case 2:
                // yield fork(handleChangedArtboards);
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleArtboardRendered)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handlePreviewDiffed)];
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
                return [4 /*yield*/, effects_1.fork(handleToggleCSSDeclaration)];
            case 11:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleCSSChanges)];
            case 12:
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
                if (!1) return [3 /*break*/, 7];
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
function handlePreviewDiffed() {
    var _a, componentId, previewName, documentChecksum, diff, state, artboards, _i, artboards_1, artboard, workspace, preppedDiff, previewPath, document_1, vmObjectMap, _b, preppedDiff_1, mutation;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!1) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.take(actions_1.PREVIEW_DIFFED)];
            case 1:
                _a = _c.sent(), componentId = _a.componentId, previewName = _a.previewName, documentChecksum = _a.documentChecksum, diff = _a.diff;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _c.sent();
                artboards = state_1.getArtboardsByInfo(componentId, previewName, state);
                if (!artboards.length) {
                    console.error("artboard " + componentId + ":" + previewName + " not found");
                    return [3 /*break*/, 0];
                }
                _i = 0, artboards_1 = artboards;
                _c.label = 3;
            case 3:
                if (!(_i < artboards_1.length)) return [3 /*break*/, 8];
                artboard = artboards_1[_i];
                workspace = state_1.getArtboardWorkspace(artboard.$id, state);
                if (!(artboard.checksum !== documentChecksum)) return [3 /*break*/, 5];
                console.info("Checksum mismatch for artboard " + artboard.componentId + ":" + artboard.previewName + ", reloading document.");
                return [4 /*yield*/, effects_1.call(reloadArtboard, artboard.$id)];
            case 4:
                _c.sent();
                return [3 /*break*/, 7];
            case 5:
                preppedDiff = slim_dom_1.prepDiff(artboard.originalDocument, diff);
                previewPath = state_1.getArtboardDocumentBodyPath(artboard).slice();
                document_1 = slim_dom_1.getVMObjectFromPath(previewPath, artboard.originalDocument);
                vmObjectMap = artboard.nativeObjectMap;
                // console.log("PATCH", artboard.componentId, artboard.previewName, preppedDiff);
                for (_b = 0, preppedDiff_1 = preppedDiff; _b < preppedDiff_1.length; _b++) {
                    mutation = preppedDiff_1[_b];
                    if (canPatchDOM(mutation, document_1, workspace)) {
                        // TODO - map mutation based on disabled props
                        vmObjectMap = slim_dom_1.patchDOM2(mutation, document_1, artboard.mount.contentDocument.body, vmObjectMap);
                    }
                    document_1 = slim_dom_1.patchNode2(mutation, document_1);
                }
                return [4 /*yield*/, effects_1.put(actions_1.artboardPatched(artboard.$id, slim_dom_1.replaceNestedChild(artboard.originalDocument, previewPath, document_1), slim_dom_1.getDocumentChecksum(document_1), vmObjectMap))];
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
var canPatchDOM = function (mutation, document, workspace) {
    if (mutation.type === slim_dom_1.CSS_SET_STYLE_PROPERTY) {
        var _a = mutation, name_1 = _a.name, newValue = _a.newValue;
        var target = slim_dom_1.getVMObjectFromPath(mutation.target, document);
        return !slim_dom_1.isCSSPropertyDisabled(target.id, name_1, document, workspace.disabledStyleDeclarations);
    }
    return true;
};
function handleArtboardRendered() {
    var _loop_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_2 = function () {
                    var artboardId;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.take([actions_1.ARTBOARD_RENDERED, actions_1.ARTBOARD_PATCHED])];
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
                if (!1) return [3 /*break*/, 3];
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
                                                    if (!1) return [3 /*break*/, 4];
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
                if (!1) return [3 /*break*/, 3];
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
            case 0: return [4 /*yield*/, effects_1.put(actions_1.artboardDOMComputedInfo(artboard.$id, slim_dom_1.computedDOMInfo2(artboard.nativeObjectMap)))];
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
                    var state, artboard, _a, dependencyUris, compressedNode, doc, checksum, idSeed, mount, renderChan, html;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, effects_1.put(actions_1.artboardLoading(artboardId))];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _b.sent();
                                artboard = state_1.getArtboardById(artboardId, state);
                                return [4 /*yield*/, effects_1.call(utils_1.getComponentPreview, artboard.componentId, artboard.previewName, state)];
                            case 3:
                                _a = _b.sent(), dependencyUris = _a[0], compressedNode = _a[1];
                                doc = slim_dom_1.uncompressRootNode([dependencyUris, compressedNode]);
                                checksum = slim_dom_1.getDocumentChecksum(doc);
                                idSeed = crc32(checksum + artboard.$id);
                                doc = slim_dom_1.setVMObjectIds(doc, idSeed);
                                mount = document.createElement("iframe");
                                mount.setAttribute("style", "border: none; width: 100%; height: 100%");
                                renderChan = redux_saga_1.eventChannel(function (emit) {
                                    mount.addEventListener("load", function () {
                                        emit(slim_dom_1.renderDOM2(doc, mount.contentDocument.body));
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
                            case 4:
                                _b.sent();
                                html = slim_dom_1.createSlimElement("html", "html", [], [
                                    slim_dom_1.createSlimElement("body", "body", [], [doc])
                                ]);
                                return [4 /*yield*/, effects_1.put(actions_1.artboardLoaded(artboard.$id, dependencyUris, html, checksum, mount))];
                            case 5:
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
function handleCreatedArtboard() {
    var artboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!1) return [3 /*break*/, 3];
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
                if (!1) return [3 /*break*/, 2];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === aerial_common2_2.MOVED && action.itemType === state_1.ARTBOARD; })];
            case 1:
                point = (_a.sent()).point;
                return [3 /*break*/, 0];
            case 2: return [2 /*return*/];
        }
    });
}
function handleToggleCSSDeclaration() {
    var _loop_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_4 = function () {
                    var _a, artboardId, declarationName, itemId, index, itemType, state, workspace;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.CSS_TOGGLE_DECLARATION_EYE_CLICKED)];
                            case 1:
                                _a = _b.sent(), artboardId = _a.artboardId, declarationName = _a.declarationName, itemId = _a.itemId, index = _a.index;
                                itemType = slim_dom_1.getVMObjectIdType(itemId);
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _b.sent();
                                workspace = state_1.getSelectedWorkspace(state);
                                return [4 /*yield*/, effects_1.call(updateSharedArtboards, itemId, artboardId, false, function (nestedObject, scopeHash, path, root) {
                                        var disabled = workspace.disabledStyleDeclarations[scopeHash][declarationName];
                                        if (itemType === slim_dom_1.SlimVMObjectType.STYLE_RULE) {
                                            return [source_mutation_1.createPropertyMutation(slim_dom_1.CSS_SET_STYLE_PROPERTY, path, declarationName, disabled ? null : nestedObject.style[index].value, null, null, index)];
                                        }
                                        return [];
                                    })];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (!1) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_4()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function updateSharedArtboards(itemId, originArtboardId, patchDocument, createMutations) {
    var itemType, state, workspace, scopeInfo, scopeHash, _loop_5, _i, _a, artboard;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                itemType = slim_dom_1.getVMObjectIdType(itemId);
                return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                scopeInfo = slim_dom_1.getStyleOwnerScopeInfo(itemId, state_1.getArtboardById(originArtboardId, state).document);
                scopeHash = scopeInfo.join("");
                _loop_5 = function (artboard) {
                    var owner, document_2, ownerPath, mutations, vmObjectMap, _i, mutations_1, mutation;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                owner = slim_dom_1.getStyleOwnerFromScopeInfo(scopeInfo, artboard);
                                if (!owner) {
                                    return [2 /*return*/, "continue"];
                                }
                                document_2 = state_1.getArtboardDocumentBody(artboard);
                                ownerPath = slim_dom_1.getVMObjectPath(owner, document_2);
                                mutations = createMutations(owner, scopeHash, ownerPath, document_2);
                                vmObjectMap = void 0;
                                if (!mutations.length) {
                                    return [2 /*return*/, "continue"];
                                }
                                for (_i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
                                    mutation = mutations_1[_i];
                                    vmObjectMap = slim_dom_1.patchDOM2(mutation, document_2, artboard.mount.contentWindow.document.body, artboard.nativeObjectMap);
                                    if (patchDocument) {
                                        document_2 = slim_dom_1.patchNode2(mutation, document_2);
                                    }
                                }
                                if (!patchDocument) return [3 /*break*/, 2];
                                return [4 /*yield*/, effects_1.put(actions_1.artboardPatched(artboard.$id, slim_dom_1.replaceNestedChild(artboard.document, state_1.getArtboardDocumentBodyPath(artboard).slice(), document_2), null, vmObjectMap))];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, effects_1.put(actions_1.artboardDOMPatched(artboard.$id, vmObjectMap))];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [4 /*yield*/, effects_1.spawn(function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, effects_1.call(redux_saga_1.delay, COMPUTE_DOM_INFO_DELAY)];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, effects_1.call(recomputeArtboardInfo, artboard)];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                })];
                            case 5:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = workspace.artboards;
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                artboard = _a[_i];
                return [5 /*yield**/, _loop_5(artboard)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
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
                                    if (!true) return [3 /*break*/, 4];
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
                        var _loop_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _loop_6 = function () {
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
                                    if (!true) return [3 /*break*/, 3];
                                    return [5 /*yield**/, _loop_6()];
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
                if (!1) return [3 /*break*/, 2];
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
    var artboardInfo, state, workspace, lastExistingArtboard, _loop_7, _i, artboardInfo_1, _a, componentId, previewName, width, height;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!true) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_ARTBOARDS_REQUESTED)];
            case 1:
                artboardInfo = (_b.sent()).artboardInfo;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                lastExistingArtboard = void 0;
                _loop_7 = function (componentId, previewName, width, height) {
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
                                        previewName: previewName,
                                        // okay to position here since the artboard will be moved
                                        // to a better location in the reducer
                                        bounds: {
                                            left: 0,
                                            top: 0,
                                            right: width,
                                            bottom: height
                                        }
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
                _a = artboardInfo_1[_i], componentId = _a.componentId, previewName = _a.previewName, width = _a.width, height = _a.height;
                return [5 /*yield**/, _loop_7(componentId, previewName, width, height)];
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
function handleCSSChanges() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleDeclarationNameChange)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleDecarationValueChange)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectorTextChanged)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleDeclarationNameChange() {
    var _loop_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_8 = function () {
                    var _a, ownerId, index, artboardId, oldName, newName;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_NAME_CHANGED)];
                            case 1:
                                _a = _b.sent(), ownerId = _a.ownerId, index = _a.index, artboardId = _a.artboardId, oldName = _a.name, newName = _a.value;
                                return [4 /*yield*/, effects_1.call(updateSharedArtboards, ownerId, artboardId, true, function (nestedObject, hash, path, root) {
                                        if (nestedObject.type === slim_dom_1.SlimVMObjectType.STYLE_RULE) {
                                            var rule = nestedObject;
                                            var value = rule.style[oldName];
                                            var mutations = [];
                                            if (oldName) {
                                                mutations.push(source_mutation_1.createPropertyMutation(slim_dom_1.CSS_SET_STYLE_PROPERTY, path, oldName, null, null, null, index));
                                            }
                                            if (newName) {
                                                mutations.push(source_mutation_1.createPropertyMutation(slim_dom_1.CSS_SET_STYLE_PROPERTY, path, newName, value || "", null, null, index));
                                            }
                                            return mutations;
                                        }
                                        return [];
                                    })];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (!1) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_8()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function handleDecarationValueChange() {
    var _loop_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_9 = function () {
                    var _a, ownerId, artboardId, name_2, value, index;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_VALUE_CHANGED)];
                            case 1:
                                _a = _b.sent(), ownerId = _a.ownerId, artboardId = _a.artboardId, name_2 = _a.name, value = _a.value, index = _a.index;
                                return [4 /*yield*/, effects_1.call(updateSharedArtboards, ownerId, artboardId, true, function (nestedObject, hash, path, root) {
                                        if (nestedObject.type === slim_dom_1.SlimVMObjectType.STYLE_RULE) {
                                            var rule = nestedObject;
                                            if (!value) {
                                                return [source_mutation_1.createPropertyMutation(slim_dom_1.CSS_DELETE_STYLE_PROPERTY, path, name_2, null, null, null, index)];
                                            }
                                            return [source_mutation_1.createPropertyMutation(slim_dom_1.CSS_SET_STYLE_PROPERTY, path, name_2, value, null, null, index)];
                                        }
                                        return [];
                                    })];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (!1) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_9()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function handleSelectorTextChanged() {
    var _loop_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_10 = function () {
                    var _a, styleRuleId, artboardId, newSelectorText;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.CSS_SELECTOR_TEXT_CHANGED)];
                            case 1:
                                _a = _b.sent(), styleRuleId = _a.styleRuleId, artboardId = _a.artboardId, newSelectorText = _a.newSelectorText;
                                return [4 /*yield*/, effects_1.call(updateSharedArtboards, styleRuleId, artboardId, true, function (styleRule, hash, path, root) {
                                        return [
                                            source_mutation_1.createSetValueMutation(slim_dom_1.CSS_SET_SELECTOR_TEXT, path, newSelectorText)
                                        ];
                                    })];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (!1) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_10()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=artboard.js.map