webpackHotUpdate(0,{

/***/ "../aerial-browser-sandbox/lib/sagas/synthetic-browser.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
var mesh_1 = __webpack_require__("./node_modules/mesh/index.js");
var redux_saga_1 = __webpack_require__("./node_modules/redux-saga/es/index.js");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var html_content_editor_1 = __webpack_require__("../aerial-browser-sandbox/lib/sagas/html-content-editor.js");
var utils_1 = __webpack_require__("../aerial-browser-sandbox/lib/utils/index.js");
var file_editor_1 = __webpack_require__("../aerial-browser-sandbox/lib/sagas/file-editor.js");
var actions_1 = __webpack_require__("../aerial-browser-sandbox/lib/actions/index.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var state_1 = __webpack_require__("../aerial-browser-sandbox/lib/state/index.js");
var environment_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/index.js");
function syntheticBrowserSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(html_content_editor_1.htmlContentEditorSaga)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(file_editor_1.fileEditorSaga)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleToggleCSSProperty)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenSyntheticWindow)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenedSyntheticWindow)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenedSyntheticProxyWindow)];
            case 6:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleFetchRequests)];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.syntheticBrowserSaga = syntheticBrowserSaga;
function handleOpenSyntheticWindow() {
    var request_1, instance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.OPEN_SYNTHETIC_WINDOW; })];
            case 1:
                request_1 = (_a.sent());
                return [4 /*yield*/, effects_1.call(openSyntheticWindowEnvironment, request_1.state, request_1.syntheticBrowserId)];
            case 2:
                instance = (_a.sent());
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function openSyntheticWindowEnvironment(_a, browserId) {
    var _b = _a.$id, windowId = _b === void 0 ? aerial_common2_1.generateDefaultId() : _b, location = _a.location, bounds = _a.bounds, scrollPosition = _a.scrollPosition;
    var main, documentId, fetch, apiHost, currentWindow, reloadChan;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                documentId = aerial_common2_1.generateDefaultId();
                return [4 /*yield*/, getFetch()];
            case 1:
                fetch = _c.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                apiHost = (_c.sent()).apiHost;
                return [4 /*yield*/, redux_saga_1.eventChannel(function (emit) {
                        var reload = function (bounds) {
                            if (currentWindow) {
                                currentWindow.dispose();
                            }
                            var SEnvWindow = environment_1.getSEnvWindowClass({
                                console: getSEnvWindowConsole(),
                                fetch: fetch,
                                reload: function () { return reload(); },
                                getProxyUrl: function (url) {
                                    return apiHost && url.substr(0, 5) !== "data:" && url.indexOf(window.location.host) === -1 ? apiHost + "/proxy/" + encodeURIComponent(url) : url;
                                },
                                createRenderer: function (window) {
                                    return window.top === window ? new environment_1.SyntheticMirrorRenderer(window) : new environment_1.SyntheticDOMRenderer(window, document);
                                }
                            });
                            var window = currentWindow = new SEnvWindow(location, browserId);
                            // ick. Better to use seed function instead to generate UIDs <- TODO.
                            window.$id = windowId;
                            window.document.$id = documentId;
                            if (bounds) {
                                window.moveTo(bounds.left, bounds.top);
                                if (bounds.right) {
                                    window.resizeTo(bounds.right - bounds.left, bounds.bottom - bounds.top);
                                }
                            }
                            emit(window);
                            return window;
                        };
                        reload(bounds);
                        return function () { };
                    })];
            case 3:
                reloadChan = _c.sent();
                return [4 /*yield*/, effects_1.spawn(function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, watchWindowExternalResourceUris(currentWindow, function () { return currentWindow.location.reload(); })];
                                case 1:
                                    _a.sent();
                                    currentWindow.$load();
                                    return [4 /*yield*/, effects_1.put(actions_1.syntheticWindowOpened(currentWindow))];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, effects_1.take(reloadChan)];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 4:
                _c.sent();
                return [2 /*return*/];
        }
    });
}
function handleToggleCSSProperty() {
    var _a, cssDeclarationId, propertyName, windowId, state, window_1, childObjects, cssDeclaration;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.TOGGLE_CSS_DECLARATION_PROPERTY)];
            case 1:
                _a = _b.sent(), cssDeclarationId = _a.cssDeclarationId, propertyName = _a.propertyName, windowId = _a.windowId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                window_1 = state_1.getSyntheticWindow(state, windowId);
                childObjects = environment_1.flattenWindowObjectSources(window_1);
                cssDeclaration = childObjects[cssDeclarationId];
                cssDeclaration.toggle(propertyName);
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
;
var PADDING = 10;
function getBestWindowPosition(browserId, filter) {
    var state, browser, entireBounds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                browser = state_1.getSyntheticBrowser(state, browserId);
                entireBounds = state_1.getSyntheticBrowserBounds(browser, filter);
                return [2 /*return*/, {
                        left: entireBounds.right ? entireBounds.right + PADDING : 0,
                        top: entireBounds.top
                    }];
        }
    });
}
;
var getSEnvWindowConsole = function () { return ({
    warn: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.warn.apply(console, ['VM '].concat(args));
    },
    log: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, ['VM '].concat(args));
    },
    error: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.error.apply(console, ['VM '].concat(args));
    },
    debug: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.debug.apply(console, ['VM '].concat(args));
    },
    info: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.info.apply(console, ['VM '].concat(args));
    }
}); };
function watchWindowExternalResourceUris(instance, reload) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // watch for changes
            return [4 /*yield*/, effects_1.spawn(function () {
                    var publicPath;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (false) return [3 /*break*/, 4];
                                return [4 /*yield*/, effects_1.take(actions_1.FILE_CONTENT_CHANGED)];
                            case 1:
                                publicPath = (_a.sent()).publicPath;
                                if (!(instance.externalResourceUris.indexOf(publicPath) !== -1)) return [3 /*break*/, 3];
                                return [4 /*yield*/, effects_1.call(reload)];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3: return [3 /*break*/, 0];
                            case 4: return [2 /*return*/];
                        }
                    });
                })];
            case 1:
                // watch for changes
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleFetchRequests() {
    var _pending, _loop_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _pending = {};
                _loop_1 = function () {
                    var req, info, uri;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.FETCH_REQUEST)];
                            case 1:
                                req = _a.sent();
                                info = req.info;
                                uri = String(info);
                                return [4 /*yield*/, effects_1.spawn(function () {
                                        var _this = this;
                                        var state, p, emitChange, text;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, effects_1.select()];
                                                case 1:
                                                    state = _a.sent();
                                                    if (_pending[uri]) {
                                                        p = _pending[uri];
                                                    }
                                                    else {
                                                        if (state.fileCache && state.fileCache[uri]) {
                                                            p = Promise.resolve(state.fileCache[uri].content);
                                                        }
                                                        else {
                                                            emitChange = true;
                                                            p = _pending[uri] = new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                                                var _a;
                                                                return __generator(this, function (_b) {
                                                                    switch (_b.label) {
                                                                        case 0:
                                                                            console.log(resolve);
                                                                            _a = resolve;
                                                                            return [4 /*yield*/, fetch(uri)];
                                                                        case 1: return [4 /*yield*/, (_b.sent()).text()];
                                                                        case 2:
                                                                            _a.apply(void 0, [_b.sent()]);
                                                                            return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); });
                                                        }
                                                    }
                                                    console.log(p, _pending[uri]);
                                                    return [4 /*yield*/, effects_1.call(p.then.bind(p))];
                                                case 2:
                                                    text = _a.sent();
                                                    if (emitChange) {
                                                        console.log("PUT CONTENT");
                                                        // yield put(fetchedContent(uri, null)
                                                    }
                                                    _pending[uri] = undefined;
                                                    return [4 /*yield*/, effects_1.put(aerial_common2_1.createRequestResponse(req.$id, text))];
                                                case 3:
                                                    _a.sent();
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
                return [5 /*yield**/, _loop_1()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function getFetch() {
    var externalResources, fetchQueue, state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                externalResources = [];
                fetchQueue = mesh_1.createQueue();
                return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                return [4 /*yield*/, effects_1.spawn(function () {
                        var _a, info, resolve, text;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.call(fetchQueue.next)];
                                case 1:
                                    _a = _b.sent(), info = _a[0], resolve = _a[1];
                                    console.log("FEQ", resolve);
                                    return [4 /*yield*/, aerial_common2_1.request(actions_1.fetchRequest(info))];
                                case 2: return [4 /*yield*/, _b.sent()];
                                case 3:
                                    text = _b.sent();
                                    resolve({
                                        text: Promise.resolve(text)
                                    });
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, function (info) { return new Promise(function (resolve, reject) {
                        fetchQueue.unshift([info, resolve]);
                    }); }];
        }
    });
}
function handleOpenedSyntheticWindow() {
    function updateProxy(window) {
        var containsProxy, proxy, disposeMirror, position, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    containsProxy = proxies.has(window.$id);
                    if (!!containsProxy) return [3 /*break*/, 5];
                    proxy = window.clone();
                    if (!(window.screenLeft || window.screenTop)) return [3 /*break*/, 1];
                    _a = { left: window.screenLeft, top: window.screenTop };
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, effects_1.call(getBestWindowPosition, window.browserId, function (existingWindow) { return existingWindow.$id !== window.$id; })];
                case 2:
                    _a = (_c.sent());
                    _c.label = 3;
                case 3:
                    position = _a;
                    proxy.moveTo(position.left, position.top);
                    proxy.resizeTo(window.innerWidth, window.innerHeight);
                    proxy.renderer = createRenderer(proxy);
                    proxy.renderer.start();
                    disposeMirror = function () { };
                    return [4 /*yield*/, effects_1.put(actions_1.syntheticWindowProxyOpened(proxy))];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = proxies.get(window.$id), proxy = _b[0], disposeMirror = _b[1];
                    _c.label = 6;
                case 6:
                    disposeMirror();
                    proxies.set(window.$id, [proxy, environment_1.mirrorWindow(proxy, window)]);
                    return [2 /*return*/];
            }
        });
    }
    var proxies, createRenderer, instance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                proxies = new Map();
                createRenderer = environment_1.createSyntheticDOMRendererFactory(document);
                ;
                _a.label = 1;
            case 1:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.SYNTHETIC_WINDOW_OPENED)];
            case 2:
                instance = (_a.sent()).instance;
                return [4 /*yield*/, effects_1.call(updateProxy, instance)];
            case 3:
                _a.sent();
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
function handleOpenedSyntheticProxyWindow() {
    var _loop_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_2 = function () {
                    var instance, thread;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.SYNTHETIC_WINDOW_PROXY_OPENED)];
                            case 1:
                                instance = (_a.sent()).instance;
                                return [4 /*yield*/, effects_1.spawn(handleSyntheticWindowInstance, instance)];
                            case 2:
                                thread = _a.sent();
                                return [4 /*yield*/, effects_1.fork(function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, effects_1.take(function (action) { return action.type === aerial_common2_1.REMOVED && action.itemId === instance.$id; })];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, effects_1.cancel(thread)];
                                                case 2:
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
                return [5 /*yield**/, _loop_2()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function handleSyntheticWindowInstance(window) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleSyntheticWindowEvents, window)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSyntheticWindowMutations, window)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleSyntheticWindowEvents(window) {
    var _a, SEnvMutationEvent, SEnvWindowOpenedEvent, SEnvURIChangedEvent, SEnvWindowEvent, chan;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = environment_1.getSEnvEventClasses(window), SEnvMutationEvent = _a.SEnvMutationEvent, SEnvWindowOpenedEvent = _a.SEnvWindowOpenedEvent, SEnvURIChangedEvent = _a.SEnvURIChangedEvent, SEnvWindowEvent = _a.SEnvWindowEvent;
                chan = redux_saga_1.eventChannel(function (emit) {
                    window.renderer.addEventListener(environment_1.SyntheticWindowRendererEvent.PAINTED, function (_a) {
                        var rects = _a.rects, styles = _a.styles;
                        emit(actions_1.syntheticWindowRectsUpdated(window.$id, rects, styles));
                    });
                    var emitStructChange = lodash_1.debounce(function () {
                        emit(actions_1.syntheticWindowChanged(window));
                    }, 0);
                    window.addEventListener(SEnvMutationEvent.MUTATION, function (event) {
                        if (window.document.readyState !== "complete")
                            return;
                        emitStructChange();
                    });
                    window.addEventListener("move", function (event) {
                        emit(actions_1.syntheticWindowMoved(window));
                    });
                    window.addEventListener("close", function (event) {
                        // TODO - need to properly clean up event listeners here
                        emit(actions_1.syntheticWindowClosed(window));
                    });
                    window.addEventListener("scroll", function (event) {
                        emit(actions_1.syntheticWindowScrolled(window.$id, {
                            left: window.scrollX,
                            top: window.scrollY
                        }));
                    });
                    window.addEventListener(SEnvURIChangedEvent.URI_CHANGED, function (_a) {
                        var uri = _a.uri;
                        emit(actions_1.syntheticWindowResourceChanged(uri));
                    });
                    window.addEventListener("resize", function (event) {
                        emit(actions_1.syntheticWindowResized(window));
                    });
                    window.addEventListener(SEnvWindowEvent.EXTERNAL_URIS_CHANGED, function () {
                        emitStructChange();
                    });
                    window.addEventListener(SEnvWindowOpenedEvent.WINDOW_OPENED, function (event) {
                        emit(actions_1.syntheticWindowOpened(event.window, window.$id));
                    });
                    window.addEventListener("scroll", function (event) {
                        emit(actions_1.syntheticWindowScrolled(window.$id, {
                            left: window.scrollX,
                            top: window.scrollY
                        }));
                    });
                    var triggerLoaded = function () {
                        if (window.document.readyState !== "complete")
                            return;
                        emit(actions_1.syntheticWindowLoaded(window));
                    };
                    window.document.addEventListener("readystatechange", triggerLoaded);
                    triggerLoaded();
                    return function () { };
                });
                return [4 /*yield*/, effects_1.fork(function () {
                        var _loop_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _loop_3 = function () {
                                        var e;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, effects_1.take(chan)];
                                                case 1:
                                                    e = _a.sent();
                                                    return [4 /*yield*/, effects_1.spawn(function () {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, effects_1.put(e)];
                                                                    case 1:
                                                                        _a.sent();
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
                                    return [5 /*yield**/, _loop_3()];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 1];
                                case 3: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}
var getTargetStyleOwners = function (element, propertyNames, targetSelectors) {
    // find all applied rules
    var appliedRules = utils_1.getSyntheticAppliedCSSRules(element.ownerDocument.defaultView.struct, element.$id).map(function (_a) {
        var rule = _a.rule;
        return rule.instance;
    });
    // cascade down style rule list until targets are found (defined in css inspector)
    var targetRules = appliedRules.filter(function (rule) { return Boolean(targetSelectors.find(function (_a) {
        var uri = _a.uri, value = _a.value;
        return rule.source.uri === uri && rule["selectorText"] == value;
    })); });
    if (!targetRules.length) {
        targetRules = [appliedRules[0]];
    }
    var ret = {};
    var _loop_4 = function (propName) {
        ret[propName] = targetRules.find(function (rule) { return Boolean(rule.style[propName]); }) || targetRules[0];
    };
    for (var _i = 0, propertyNames_1 = propertyNames; _i < propertyNames_1.length; _i++) {
        var propName = propertyNames_1[_i];
        _loop_4(propName);
    }
    return ret;
};
var createStyleMutation = function (target) {
    if (target.struct.$type === state_1.SYNTHETIC_ELEMENT) {
        var element = target;
        return environment_1.createSetElementAttributeMutation(element, "style", element.getAttribute("style"));
    }
    else if (target.struct.$type === state_1.SYNTHETIC_CSS_STYLE_RULE) {
        var rule = target;
        return environment_1.cssStyleRuleSetStyle(rule, rule.style);
    }
};
function handleSyntheticWindowMutations(window) {
    var takeWindowAction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                takeWindowAction = function (type, test) {
                    if (test === void 0) { test = function (action) { return action.syntheticWindowId === window.$id; }; }
                    return effects_1.take(function (action) { return action.type === type && test(action); });
                };
                return [4 /*yield*/, effects_1.fork(function handleRemoveNode() {
                        var _a, itemType, itemId, target, parent_1, removeMutation;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(function (action) { return action.type === aerial_common2_1.REMOVED && state_1.isSyntheticNodeType(action.itemType) && !!environment_1.flattenWindowObjectSources(window.struct)[action.itemId]; })];
                                case 1:
                                    _a = (_b.sent()), itemType = _a.itemType, itemId = _a.itemId;
                                    target = environment_1.flattenWindowObjectSources(window.struct)[itemId];
                                    parent_1 = target.parentNode;
                                    removeMutation = environment_1.createParentNodeRemoveChildMutation(parent_1, target);
                                    // remove immediately so that it's reflected in the canvas
                                    parent_1.removeChild(target);
                                    return [4 /*yield*/, aerial_common2_1.request(actions_1.deferApplyFileMutationsRequest(removeMutation))];
                                case 2: return [4 /*yield*/, _b.sent()];
                                case 3:
                                    _b.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleMoveNode() {
                        var _a, itemType, itemId, point, targetSelectors, syntheticWindow, _b, syntheticNode, _c, originalRect, computedStyle, relativeRect, envElement, _d, top_1, left, position;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(function (action) { return action.type === aerial_common2_1.MOVED && state_1.isSyntheticNodeType(action.itemType) && !!environment_1.flattenWindowObjectSources(window.struct)[action.itemId]; })];
                                case 1:
                                    _a = (_e.sent()), itemType = _a.itemType, itemId = _a.itemId, point = _a.point, targetSelectors = _a.targetSelectors;
                                    _b = state_1.getSyntheticWindow;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    syntheticWindow = _b.apply(void 0, [_e.sent(), window.$id]);
                                    _c = state_1.getSyntheticNodeById;
                                    return [4 /*yield*/, effects_1.select()];
                                case 3:
                                    syntheticNode = _c.apply(void 0, [_e.sent(), itemId]);
                                    originalRect = syntheticWindow.allComputedBounds[syntheticNode.$id];
                                    computedStyle = syntheticWindow.allComputedStyles[syntheticNode.$id];
                                    relativeRect = aerial_common2_1.roundBounds(aerial_common2_1.shiftBounds(utils_1.convertAbsoluteBoundsToRelative(aerial_common2_1.pointToBounds(point), syntheticNode, syntheticWindow), {
                                        left: -syntheticWindow.bounds.left,
                                        top: -syntheticWindow.bounds.top
                                    }));
                                    envElement = environment_1.flattenWindowObjectSources(window.struct)[syntheticNode.$id];
                                    _d = getTargetStyleOwners(envElement, ["top", "left", "position"], targetSelectors), top_1 = _d.top, left = _d.left, position = _d.position;
                                    // TODO - get best CSS style
                                    if (computedStyle.position === "static") {
                                        position.style.setProperty("position", "relative");
                                    }
                                    // transitions will foo with dragging, so temporarily
                                    // disable them
                                    // TODO - need to fix this -- causes jumpy CSS inspector
                                    // envElement.style.setProperty("transition", "none");
                                    left.style.setProperty("left", relativeRect.left + "px");
                                    top_1.style.setProperty("top", relativeRect.top + "px");
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function () {
                        var _a, syntheticNodeId, textContent, syntheticNode;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 2];
                                    return [4 /*yield*/, takeWindowAction(actions_1.SYNTHETIC_NODE_TEXT_CONTENT_CHANGED)];
                                case 1:
                                    _a = (_b.sent()), syntheticNodeId = _a.syntheticNodeId, textContent = _a.textContent;
                                    syntheticNode = environment_1.flattenWindowObjectSources(window.struct)[syntheticNodeId];
                                    syntheticNode.textContent = textContent;
                                    return [3 /*break*/, 0];
                                case 2: return [2 /*return*/];
                            }
                        });
                    })];
            case 3:
                _a.sent();
                // TODO: deprecated. changes must be explicit in the editor instead of doing diff / patch work
                // since we may end up editing the wrong node otherwise (CC).
                return [4 /*yield*/, effects_1.fork(function handleNodeStoppedEditing() {
                        var nodeId, node, mutation;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 3];
                                    return [4 /*yield*/, takeWindowAction(actions_1.NODE_VALUE_STOPPED_EDITING)];
                                case 1:
                                    nodeId = (_a.sent()).nodeId;
                                    node = environment_1.flattenWindowObjectSources(window.struct)[nodeId];
                                    mutation = environment_1.createSetElementTextContentMutation(node, node.textContent);
                                    return [4 /*yield*/, aerial_common2_1.request(actions_1.deferApplyFileMutationsRequest(mutation))];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 0];
                                case 3: return [2 /*return*/];
                            }
                        });
                    })];
            case 4:
                // TODO: deprecated. changes must be explicit in the editor instead of doing diff / patch work
                // since we may end up editing the wrong node otherwise (CC).
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleMoveNodeStopped() {
                        var _loop_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _loop_5 = function () {
                                        var _a, itemType, itemId, targetSelectors;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0: return [4 /*yield*/, effects_1.take(function (action) { return action.type === aerial_common2_1.STOPPED_MOVING && state_1.isSyntheticNodeType(action.itemType) && !!environment_1.flattenWindowObjectSources(window.struct)[action.itemId]; })];
                                                case 1:
                                                    _a = (_b.sent()), itemType = _a.itemType, itemId = _a.itemId, targetSelectors = _a.targetSelectors;
                                                    return [4 /*yield*/, effects_1.spawn(function () {
                                                            var target, _a, top, left, position, mutations;
                                                            return __generator(this, function (_b) {
                                                                switch (_b.label) {
                                                                    case 0:
                                                                        target = environment_1.flattenWindowObjectSources(window.struct)[itemId];
                                                                        _a = getTargetStyleOwners(target, ["top", "left", "position"], targetSelectors), top = _a.top, left = _a.left, position = _a.position;
                                                                        mutations = lodash_1.uniq([top, left, position]).map(createStyleMutation);
                                                                        return [4 /*yield*/, aerial_common2_1.request(actions_1.deferApplyFileMutationsRequest.apply(void 0, mutations))];
                                                                    case 1: return [4 /*yield*/, _b.sent()];
                                                                    case 2:
                                                                        _b.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        })];
                                                case 2:
                                                    _b.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a.label = 1;
                                case 1:
                                    if (false) return [3 /*break*/, 3];
                                    return [5 /*yield**/, _loop_5()];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 1];
                                case 3: return [2 /*return*/];
                            }
                        });
                    })];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function () {
                        var _a, left, top_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 2];
                                    return [4 /*yield*/, takeWindowAction(actions_1.SYNTHETIC_WINDOW_SCROLL)];
                                case 1:
                                    _a = (_b.sent()).scrollPosition, left = _a.left, top_2 = _a.top;
                                    window.scrollTo(left, top_2);
                                    return [3 /*break*/, 0];
                                case 2: return [2 /*return*/];
                            }
                        });
                    })];
            case 6:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleResized() {
                        var point;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 2];
                                    return [4 /*yield*/, takeWindowAction(aerial_common2_1.MOVED, function (action) { return action.itemId === window.$id; })];
                                case 1:
                                    point = (_a.sent()).point;
                                    window.moveTo(point.left, point.top);
                                    return [3 /*break*/, 0];
                                case 2: return [2 /*return*/];
                            }
                        });
                    })];
            case 7:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleResized() {
                        var bounds;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 2];
                                    return [4 /*yield*/, takeWindowAction(aerial_common2_1.RESIZED, function (action) { return action.itemId === window.$id; })];
                                case 1:
                                    bounds = (_a.sent()).bounds;
                                    window.moveTo(bounds.left, bounds.top);
                                    window.resizeTo(bounds.right - bounds.left, bounds.bottom - bounds.top);
                                    return [3 /*break*/, 0];
                                case 2: return [2 /*return*/];
                            }
                        });
                    })];
            case 8:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=synthetic-browser.js.map

/***/ })

})