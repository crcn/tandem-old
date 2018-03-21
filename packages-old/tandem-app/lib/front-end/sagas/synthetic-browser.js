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
var effects_1 = require("redux-saga/effects");
var actions_1 = require("front-end/actions");
function frontEndSyntheticBrowserSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleTextEditBlur)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleWindowMousePanned)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleScrollInFullScreenMode)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleTextEditorEscaped)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleLoadedSavedState)];
            case 5:
                _a.sent();
                // yield fork(handleCSSDeclarationChanges);
                return [4 /*yield*/, effects_1.fork(handleFileChanged)];
            case 6:
                // yield fork(handleCSSDeclarationChanges);
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.frontEndSyntheticBrowserSaga = frontEndSyntheticBrowserSaga;
// function* handleEmptyWindowsUrlAdded() {
//   while(true) {
//     const {url}: EmptyWindowsUrlAdded = yield take(EMPTY_WINDOWS_URL_ADDED);
//     const state: ApplicationState = yield select();
//     yield put(openSyntheticWindowRequest({ location: url }, getSelectedWorkspace(state).browserId));
//   }
// }
// function* handleWatchWindowResource() {
//   let watchingUris: string[] = [];
//   while(true) {
//     const action = yield take([
//       SYNTHETIC_WINDOW_CHANGED,
//       SYNTHETIC_WINDOW_LOADED,
//       SYNTHETIC_WINDOW_CLOSED,
//       REMOVED
//     ]);
//     const state: ApplicationState = yield select();
//     const allUris = uniq(state.browserStore.records.reduce((a, b) => {
//       return [...a, ...b.windows.reduce((a2, b2) => {
//         return [...a2, ...b2.externalResourceUris ];
//       }, [])];
//     }, [])) as string[];
//     const updates = diffArray(allUris, watchingUris, (a, b) => a === b ? 0 : -1).mutations.filter((mutation) => mutation.type === ARRAY_UPDATE);
//     // no changes, so just continue
//     if (updates.length === allUris.length) {
//       continue;
//     }
//     yield spawn(function*() {
//       yield call(apiWatchUris, watchingUris = allUris, state);
//     });
//   }
// }
function handleTextEditorEscaped() {
    var _a, sourceEvent, nodeId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!true) return [3 /*break*/, 4];
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
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}
function handleTextEditBlur() {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}
function nodeValueStoppedEditing(nodeId) {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}
function handleScrollInFullScreenMode() {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}
function handleFileChanged() {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}
function handleLoadedSavedState() {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}
function persistDeclarationChange(declaration, name, value) {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}
// TODO - move this to synthetic browser
function handleCSSDeclarationChanges() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // yield fork(function* handleNameChanges() {
            //   while(true) {
            //     const { value, artboardId, declarationId }: CSSDeclarationChanged = yield take(CSS_DECLARATION_NAME_CHANGED);
            //     const state: ApplicationState = yield select();
            //     // const window = getSyntheticWindow(state, artboardId);
            //   }
            // });
            return [4 /*yield*/, effects_1.fork(function handleValueChanges() {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                })];
            case 1:
                // yield fork(function* handleNameChanges() {
                //   while(true) {
                //     const { value, artboardId, declarationId }: CSSDeclarationChanged = yield take(CSS_DECLARATION_NAME_CHANGED);
                //     const state: ApplicationState = yield select();
                //     // const window = getSyntheticWindow(state, artboardId);
                //   }
                // });
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleNewDeclaration() {
                        return __generator(this, function (_a) {
                            return [2 /*return*/];
                        });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
// fugly quick momentum scrolling implementation
function handleWindowMousePanned() {
    var deltaTop, deltaLeft, currentWindowId, panStartScrollPosition, lastPaneEvent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deltaTop = 0;
                deltaLeft = 0;
                return [4 /*yield*/, effects_1.fork(function () {
                        var artboardId;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!true) return [3 /*break*/, 2];
                                    return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_START)];
                                case 1:
                                    artboardId = (_a.sent()).artboardId;
                                    return [3 /*break*/, 0];
                                case 2: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/];
                        });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
var createDeferredPromise = function () {
    var _resolve;
    var _reject;
    var promise = new Promise(function (resolve, reject) {
        _resolve = resolve;
        _reject = reject;
    });
    return {
        resolve: _resolve,
        reject: _reject,
        promise: promise
    };
};
var WINDOW_SYNC_MS = 1000 / 30;
//# sourceMappingURL=synthetic-browser.js.map