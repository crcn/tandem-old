webpackHotUpdate(0,{

/***/ "../aerial-browser-sandbox/lib/environment/window.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var state_1 = __webpack_require__("../aerial-browser-sandbox/lib/state/index.js");
var location_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/location.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var events_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/events/index.js");
var renderers_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/renderers/index.js");
var timers_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/timers.js");
var media_match_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/media-match.js");
var local_storage_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/local-storage.js");
var css_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/css/index.js");
var nodes_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/nodes/index.js");
var custom_element_registry_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/custom-element-registry.js");
var nwmatcher = __webpack_require__("../../../../../public/nwmatcher/src/nwmatcher.js");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/constants.js");
;
exports.mirrorWindow = function (target, source) {
    var _a = events_1.getSEnvEventClasses(), SEnvMutationEvent = _a.SEnvMutationEvent, SEnvWindowOpenedEvent = _a.SEnvWindowOpenedEvent, SEnvURIChangedEvent = _a.SEnvURIChangedEvent, SEnvWindowEvent = _a.SEnvWindowEvent;
    source.renderer.source = target.renderer;
    if (target.$id !== source.$id) {
        throw new Error("target must be a previous clone of the source.");
    }
    var sync = function () {
        exports.patchWindow(target, exports.diffWindow(target, source));
        // sync window Ids to ensure future mutation events. This
        // also doubles as a sanity check for patching. 
        exports.syncWindowIds(target, source);
    };
    // TODO - need to sync mutations from target to source since
    // the editor mutates the target -- changes need to be reflected in the source
    // so that incomming source mutations are properly mapped back to the target. 
    // happens with dynamic content.
    var onMutation = function (_a) {
        var mutation = _a.mutation;
        var childObjects = exports.flattenWindowObjectSources(target.struct);
        // likely a full window reload. In that case, need to diff & patch
        if (!childObjects[mutation.target.$id]) {
            console.warn("Could not find matching mutation target, slowly syncing windows.", mutation);
            sync();
        }
        else {
            exports.patchWindow(target, [mutation]);
        }
    };
    var mirrorEvent = function (event) {
        target.dispatchEvent(event);
    };
    var tryPatching = function () {
        if (source.document.readyState !== "complete") {
            return;
        }
        sync();
        source.addEventListener(SEnvMutationEvent.MUTATION, onMutation);
    };
    var onResize = function (event) {
        target.resizeTo(source.innerWidth, source.innerHeight);
    };
    var onMove = function (event) {
        target.moveTo(source.screenLeft, source.screenTop);
    };
    var onTargetMove = function (event) {
        source.moveTo(target.screenLeft, target.screenTop);
    };
    var onTargetResize = function (event) {
        source.resizeTo(target.innerWidth, target.innerHeight);
    };
    var onClose = function (event) {
        target.close();
    };
    var onResourceChanged = function (event) {
        target.$setExternalUris(source.externalResourceUris);
    };
    var onUriChanged = function (event) { return target.dispatchEvent(event); };
    source.resizeTo(target.innerWidth, target.innerHeight);
    source.moveTo(target.screenLeft, target.screenTop);
    source.addEventListener(SEnvWindowOpenedEvent.WINDOW_OPENED, mirrorEvent);
    source.addEventListener("move", onMove);
    source.addEventListener("resize", onResize);
    source.addEventListener("close", onClose);
    source.addEventListener(SEnvURIChangedEvent.URI_CHANGED, onUriChanged);
    target.addEventListener("move", onTargetMove);
    target.addEventListener("resize", onTargetResize);
    source.document.addEventListener("readystatechange", tryPatching);
    source.addEventListener(SEnvWindowEvent.EXTERNAL_URIS_CHANGED, onResourceChanged);
    tryPatching();
    return function () {
        source.removeEventListener(SEnvMutationEvent.MUTATION, onMutation);
        source.removeEventListener(SEnvWindowOpenedEvent.WINDOW_OPENED, mirrorEvent);
        source.removeEventListener(SEnvURIChangedEvent.URI_CHANGED, onUriChanged);
        source.removeEventListener("move", onMove);
        source.removeEventListener("resize", onResize);
        source.removeEventListener("close", onClose);
        target.removeEventListener("move", onTargetMove);
        target.removeEventListener("resize", onTargetResize);
        target.removeEventListener("readystatechange", tryPatching);
        source.removeEventListener(SEnvWindowEvent.EXTERNAL_URIS_CHANGED, onResourceChanged);
    };
};
var defaultFetch = (function (info) {
    throw new Error("Fetch not provided for " + info);
});
var throwUnsupportedMethod = function () {
    throw new Error("Unsupported");
};
exports.getSEnvWindowClass = aerial_common2_1.weakMemo(function (context) {
    var createRenderer = context.createRenderer, _a = context.fetch, fetch = _a === void 0 ? defaultFetch : _a, _b = context.getProxyUrl, getProxyUrl = _b === void 0 ? lodash_1.identity : _b;
    var SEnvEventTarget = events_1.getSEnvEventTargetClass(context);
    var SEnvDocument = nodes_1.getSEnvDocumentClass(context);
    var SEnvLocation = location_1.getSEnvLocationClass(context);
    var SEnvCustomElementRegistry = custom_element_registry_1.getSEnvCustomElementRegistry(context);
    var SEnvElement = nodes_1.getSEnvElementClass(context);
    var SEnvHTMLElement = nodes_1.getSEnvHTMLElementClass(context);
    var SEnvLocalStorage = local_storage_1.getSEnvLocalStorageClass(context);
    var SEnvDOMImplementation = nodes_1.getSEnvDOMImplementationClass(context);
    var SEnvTimers = timers_1.getSEnvTimerClasses(context).SEnvTimers;
    var _c = events_1.getSEnvEventClasses(context), SEnvEvent = _c.SEnvEvent, SEnvMutationEvent = _c.SEnvMutationEvent, SEnvWindowOpenedEvent = _c.SEnvWindowOpenedEvent, SEnvURIChangedEvent = _c.SEnvURIChangedEvent, SEnvWindowEvent = _c.SEnvWindowEvent;
    var _d = css_1.getSEnvCSSRuleClasses(context), SEnvCSSFontFace = _d.SEnvCSSFontFace, SEnvCSSKeyframesRule = _d.SEnvCSSKeyframesRule, SEnvCSSMediaRule = _d.SEnvCSSMediaRule, SEnvCSSStyleRule = _d.SEnvCSSStyleRule, SEnvUnknownGroupingRule = _d.SEnvUnknownGroupingRule;
    var SEnvCSSStyleDeclaration = css_1.getSEnvCSSStyleDeclarationClass(context);
    var SEnvCSSStyleSheet = css_1.getSEnvCSSStyleSheetClass(context);
    // register default HTML tag names
    var TAG_NAME_MAP = nodes_1.getSEnvHTMLElementClasses(context);
    var SEnvNavigator = /** @class */ (function () {
        function SEnvNavigator() {
            this.appCodeName = "Tandem";
            this.appName = "Tandem";
            this.appVersion = "1.0";
            this.platform = "Tandem";
            this.product = "Tandem";
            this.productSub = "tandem";
            this.userAgent = "Tandem";
            this.vendor = "Tandem";
            this.vendorSub = "Tandem";
            this.cookieEnabled = true;
            this.onLine = true;
            this.language = "en/us";
            this.maxTouchPoints = 0;
            this.plugins = [];
            this.languages = ["en/us"];
        }
        SEnvNavigator.prototype.getUserMedia = function (constraints, successCallback, errorCallback) {
            throwUnsupportedMethod();
        };
        SEnvNavigator.prototype.sendBeacon = function (url, data) {
            throwUnsupportedMethod();
            return false;
        };
        SEnvNavigator.prototype.msSaveBlob = function (blob, defaultName) {
            throwUnsupportedMethod();
            return false;
        };
        SEnvNavigator.prototype.msSaveOrOpenBlob = function (blob, defaultName) {
            throwUnsupportedMethod();
            return false;
        };
        SEnvNavigator.prototype.getGamepads = function () {
            throwUnsupportedMethod();
            return [];
        };
        SEnvNavigator.prototype.javaEnabled = function () {
            return false;
        };
        SEnvNavigator.prototype.msLaunchUri = function (uri, successCallback, noHandlerCallback) {
            throwUnsupportedMethod();
        };
        SEnvNavigator.prototype.requestMediaKeySystemAccess = function (keySystem, supportedConfigurations) {
            return null;
        };
        SEnvNavigator.prototype.vibrate = function (pattern) {
            throwUnsupportedMethod();
            return false;
        };
        SEnvNavigator.prototype.confirmSiteSpecificTrackingException = function (args) {
            throwUnsupportedMethod();
            return false;
        };
        SEnvNavigator.prototype.confirmWebWideTrackingException = function (args) {
            throwUnsupportedMethod();
            return false;
        };
        SEnvNavigator.prototype.removeSiteSpecificTrackingException = function (args) {
            throwUnsupportedMethod();
        };
        SEnvNavigator.prototype.removeWebWideTrackingException = function (args) {
            throwUnsupportedMethod();
        };
        SEnvNavigator.prototype.storeSiteSpecificTrackingException = function (args) {
            throwUnsupportedMethod();
        };
        SEnvNavigator.prototype.storeWebWideTrackingException = function (args) {
            throwUnsupportedMethod();
        };
        return SEnvNavigator;
    }());
    return /** @class */ (function (_super) {
        __extends(SEnvWindow, _super);
        function SEnvWindow(origin, top) {
            var _this = _super.call(this) || this;
            _this.console = context.console;
            _this.$synthetic = true;
            _this.name = "";
            _this.scrollX = 0;
            _this.scrollY = 0;
            _this.CustomEvent = SEnvEvent;
            _this._scrollRect = { width: Infinity, height: Infinity };
            // classes
            _this.EventTarget = SEnvEventTarget;
            _this.Element = SEnvElement;
            _this.HTMLElement = SEnvHTMLElement;
            _this._childWindowCount = 0;
            console.log("ORIG");
            if (origin.charAt(0) === "/") {
                origin = window.location.protocol + "//" + window.location.host + origin;
            }
            _this._onRendererPainted = _this._onRendererPainted.bind(_this);
            _this.clearImmediate = _this.clearImmediate.bind(_this);
            _this.clearTimeout = _this.clearTimeout.bind(_this);
            _this.clearInterval = _this.clearInterval.bind(_this);
            _this.setImmediate = _this.setImmediate.bind(_this);
            _this.setTimeout = _this.setTimeout.bind(_this);
            _this.setInterval = _this.setInterval.bind(_this);
            _this._timers = new SEnvTimers();
            _this.CSSFontFaceRule = SEnvCSSFontFace;
            _this.CSSKeyframesRule = SEnvCSSKeyframesRule;
            _this.CSSKeyframeRule = SEnvCSSStyleRule;
            _this.CSSMediaRule = SEnvCSSMediaRule;
            _this.CSSStyleRule = SEnvCSSStyleRule;
            _this.UnknownGroupingRule = SEnvUnknownGroupingRule;
            _this.CSSStyleDeclaration = SEnvCSSStyleDeclaration;
            _this.CSSStyleSheet = SEnvCSSStyleSheet;
            _this.implementation = new SEnvDOMImplementation(_this);
            _this.URIChangedEvent = SEnvURIChangedEvent;
            _this.uid = _this.$id = aerial_common2_1.generateDefaultId();
            _this.location = new SEnvLocation(origin, context.reload);
            _this.window = _this.self = _this;
            _this.top = top || _this;
            _this.localStorage = new SEnvLocalStorage([]);
            _this.innerWidth = constants_1.DEFAULT_WINDOW_WIDTH;
            _this.innerHeight = constants_1.DEFAULT_WINDOW_HEIGHT;
            _this.moveTo(0, 0);
            _this.externalResourceUris = [];
            _this.navigator = new SEnvNavigator();
            _this.fetch = function (info) { return __awaiter(_this, void 0, void 0, function () {
                var inf, dir, fetchPromise, ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inf = String(info);
                            if (!/http/.test(inf)) {
                                if (inf.charAt(0) !== "/") {
                                    dir = this.location.pathname.split("/");
                                    dir.pop();
                                    inf = dir.join("/") + inf;
                                }
                                inf = this.location.protocol + "//" + this.location.host + inf;
                            }
                            fetchPromise = fetch(inf);
                            return [4 /*yield*/, fetchPromise];
                        case 1:
                            ret = _a.sent();
                            this.$setExternalUris(this.externalResourceUris.concat([info]));
                            return [2 /*return*/, ret];
                    }
                });
            }); };
            var customElements = _this.customElements = new SEnvCustomElementRegistry(_this);
            for (var tagName in TAG_NAME_MAP) {
                customElements.define(tagName, TAG_NAME_MAP[tagName]);
            }
            _this._matchMedia = media_match_1.createMediaMatcher(_this);
            _this.document = _this.implementation.createHTMLDocument(null);
            _this.renderer = (createRenderer || renderers_1.createNoopRenderer)(_this);
            _this.document.addEventListener(SEnvMutationEvent.MUTATION, _this._onDocumentMutation.bind(_this));
            return _this;
        }
        SEnvWindow.prototype.getSourceUri = function (uri) {
            return uri;
        };
        SEnvWindow.prototype.didChange = function () {
            this._struct = undefined;
        };
        Object.defineProperty(SEnvWindow.prototype, "renderer", {
            get: function () {
                return this._renderer;
            },
            set: function (value) {
                if (this._renderer) {
                    this._renderer.removeEventListener(renderers_1.SyntheticWindowRendererEvent.PAINTED, this._onRendererPainted);
                }
                this._renderer = value;
                this._renderer.addEventListener(renderers_1.SyntheticWindowRendererEvent.PAINTED, this._onRendererPainted);
            },
            enumerable: true,
            configurable: true
        });
        SEnvWindow.prototype.$setExternalUris = function (uris) {
            this.externalResourceUris = uris.slice();
            this._struct = undefined;
            this.dispatchEvent(new SEnvWindowEvent(SEnvWindowEvent.EXTERNAL_URIS_CHANGED));
        };
        Object.defineProperty(SEnvWindow.prototype, "struct", {
            get: function () {
                if (!this._struct) {
                    this._struct = state_1.createSyntheticWindow({
                        $id: this.$id,
                        location: this.location.toString(),
                        document: this.document.struct,
                        instance: this,
                        renderContainer: this.renderer.container,
                        externalResourceUris: this.externalResourceUris.slice(),
                        scrollPosition: {
                            left: this.scrollX,
                            top: this.scrollY,
                        },
                        bounds: {
                            left: this.screenLeft,
                            top: this.screenTop,
                            right: this.screenLeft + this.innerWidth,
                            bottom: this.screenTop + this.innerHeight
                        }
                    });
                }
                return this._struct;
            },
            enumerable: true,
            configurable: true
        });
        SEnvWindow.prototype.dispose = function () {
            this.renderer.dispose();
            this._timers.dispose();
        };
        Object.defineProperty(SEnvWindow.prototype, "$selector", {
            get: function () {
                if (this._selector)
                    return this._selector;
                this._selector = nwmatcher(this);
                // VERBOSITY = false to prevent breaking on invalid selector rules
                this._selector.configure({ CACHING: true, VERBOSITY: false });
                return this._selector;
            },
            enumerable: true,
            configurable: true
        });
        SEnvWindow.prototype.reloadWhenUrisChange = function (uris) {
            this.$setExternalUris(this.externalResourceUris.concat(uris));
        };
        SEnvWindow.prototype.alert = function (message) { };
        SEnvWindow.prototype.blur = function () { };
        SEnvWindow.prototype.cancelAnimationFrame = function (handle) { };
        SEnvWindow.prototype.captureEvents = function () { };
        SEnvWindow.prototype.close = function () {
            this.closed = true;
            var event = new SEnvEvent();
            event.initEvent("close", true, true);
            this.dispatchEvent(event);
        };
        SEnvWindow.prototype.confirm = function (message) {
            return false;
        };
        SEnvWindow.prototype.atob = function (encodedString) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.btoa = function (rawString) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.departFocus = function (navigationReason, origin) {
        };
        SEnvWindow.prototype.focus = function () {
        };
        SEnvWindow.prototype.getComputedStyle = function (elt, pseudoElt) {
            return this.renderer.getComputedStyle(elt);
        };
        SEnvWindow.prototype.getMatchedCSSRules = function (elt, pseudoElt) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.getSelection = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.matchMedia = function (mediaQuery) {
            return {
                matches: this._matchMedia(mediaQuery),
                media: mediaQuery,
                addListener: null,
                removeListener: null,
            };
        };
        SEnvWindow.prototype.clearInterval = function (handle) {
            return this._timers.clearInterval(handle);
        };
        SEnvWindow.prototype.clearTimeout = function (handle) {
            return this._timers.clearTimeout(handle);
        };
        SEnvWindow.prototype.setInterval = function (handler, ms) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return (_a = this._timers).setInterval.apply(_a, [handler, ms].concat(args));
            var _a;
        };
        SEnvWindow.prototype.clone = function (deep) {
            var window = new SEnvWindow(this.location.toString(), this.top === this ? null : this.top);
            window.$id = this.$id;
            if (deep !== false) {
                window.document.$id = this.document.$id;
                exports.patchWindow(window, exports.diffWindow(window, this));
            }
            window.renderer.start();
            return window;
        };
        SEnvWindow.prototype.setTimeout = function (handler, ms) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return (_a = this._timers).setTimeout.apply(_a, [handler, ms].concat(args));
            var _a;
        };
        SEnvWindow.prototype.clearImmediate = function (handle) {
            return this._timers.clearImmediate(handle);
        };
        SEnvWindow.prototype.setImmediate = function (handler) {
            return this._timers.setImmediate(handler);
        };
        SEnvWindow.prototype.moveBy = function (x, y) {
        };
        SEnvWindow.prototype.moveTo = function (x, y) {
            if (x === void 0) { x = this.screenLeft; }
            if (y === void 0) { y = this.screenTop; }
            x = x && Math.round(x);
            y = y && Math.round(y);
            if (x === this.screenLeft && y === this.screenTop) {
                return;
            }
            this.screenLeft = this.screenY = x;
            this.screenTop = this.screenX = y;
            this.didChange();
            var e = new SEnvEvent();
            e.initEvent("move", true, true);
            this.dispatchEvent(e);
        };
        SEnvWindow.prototype.msWriteProfilerMark = function (profilerMarkName) {
        };
        SEnvWindow.prototype.open = function (url, target, features, replace) {
            var _this = this;
            var windowId = this.$id + "." + (++this._childWindowCount);
            var open = function () {
                var SEnvWindow = exports.getSEnvWindowClass({ console: console, fetch: fetch, reload: open });
                var window = new SEnvWindow(url);
                window.$id = windowId;
                window.document.$id = window.$id + "-document";
                window.$load();
                var event = new SEnvWindowOpenedEvent();
                event.initWindowOpenedEvent(window);
                _this.dispatchEvent(event);
                return window;
            };
            return open();
        };
        SEnvWindow.prototype.postMessage = function (message, targetOrigin, transfer) {
        };
        SEnvWindow.prototype.print = function () {
        };
        SEnvWindow.prototype.prompt = function (message, _default) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.releaseEvents = function () {
        };
        SEnvWindow.prototype.requestAnimationFrame = function (callback) {
            if (!this._animationFrameRequests) {
                this._animationFrameRequests = [];
            }
            this._animationFrameRequests.push(callback);
            return -1;
        };
        SEnvWindow.prototype.resizeBy = function (x, y) {
        };
        SEnvWindow.prototype.resizeTo = function (x, y) {
            if (x === void 0) { x = this.innerWidth; }
            if (y === void 0) { y = this.innerHeight; }
            x = x && Math.round(x);
            y = y && Math.round(y);
            if (x === this.innerWidth && y === this.innerHeight) {
                return;
            }
            this.innerWidth = x;
            this.innerHeight = y;
            this.didChange();
            var event = new SEnvEvent();
            event.initEvent("resize", true, true);
            this.dispatchEvent(event);
        };
        SEnvWindow.prototype.scroll = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.scrollTo.apply(this, args);
        };
        SEnvWindow.prototype.scrollBy = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
        };
        SEnvWindow.prototype._throwUnsupportedMethod = function () {
            throw new Error("This node type does not support this method.");
        };
        SEnvWindow.prototype.scrollTo = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var left;
            var top;
            // scroll with options
            if (typeof args[0] === "object") {
            }
            else {
                left = args[0], top = args[1];
            }
            // TODO - use computed bounds here too
            left = lodash_1.clamp(left, 0, this._scrollRect.width);
            top = lodash_1.clamp(top, 0, this._scrollRect.height);
            var oldScrollX = this.scrollX;
            var oldScrollY = this.scrollY;
            // no change
            if (oldScrollX === left && oldScrollY === top) {
                return;
            }
            this.scrollX = left;
            this.scrollY = top;
            var event = new SEnvEvent();
            event.initEvent("scroll", true, true);
            this.dispatchEvent(event);
        };
        SEnvWindow.prototype.stop = function () {
        };
        SEnvWindow.prototype.webkitCancelAnimationFrame = function (handle) {
        };
        SEnvWindow.prototype.webkitConvertPointFromNodeToPage = function (node, pt) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.webkitConvertPointFromPageToNode = function (node, pt) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.webkitRequestAnimationFrame = function (callback) {
            this._throwUnsupportedMethod();
            return -1;
        };
        SEnvWindow.prototype.createImageBitmap = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Promise.reject(null);
        };
        SEnvWindow.prototype.$load = function () {
            return __awaiter(this, void 0, void 0, function () {
                var location, response, content;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            location = this.location.toString();
                            this.renderer.start();
                            if (!location) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.fetch(location)];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.text()];
                        case 2:
                            content = _a.sent();
                            return [4 /*yield*/, this.document.$load(content)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.document.$load("")];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SEnvWindow.prototype._onDocumentMutation = function (event) {
            this.didChange();
            var eventClone = new SEnvMutationEvent();
            eventClone.initMutationEvent(event.mutation);
            this.dispatchEvent(eventClone);
        };
        SEnvWindow.prototype._onRendererPainted = function (event) {
            this._scrollRect = event.scrollRect;
            // sync scroll position that may have changed
            // during window resize, otherwise 
            this.scrollTo(event.scrollPosition.left, event.scrollPosition.top);
            if (this._animationFrameRequests) {
                var animationFrameRequests = this._animationFrameRequests;
                this._animationFrameRequests = [];
                for (var i = 0, n = animationFrameRequests.length; i < n; i++) {
                    animationFrameRequests[i]();
                }
            }
        };
        return SEnvWindow;
    }(SEnvEventTarget));
});
exports.openSyntheticEnvironmentWindow = function (location, context) {
    var SEnvWindow = exports.getSEnvWindowClass(context);
    var window = new SEnvWindow(location);
    window.$load();
    return window;
};
exports.diffWindow = function (oldWindow, newWindow) {
    return nodes_1.diffDocument(oldWindow.document, newWindow.document);
};
exports.flattenWindowObjectSources = function (window) {
    if (!window.document) {
        return {};
    }
    return nodes_1.flattenDocumentSources(window.document);
};
exports.windowMutators = __assign({}, nodes_1.documentMutators);
exports.patchWindow = function (oldWindow, mutations) {
    var childObjects = exports.flattenWindowObjectSources(oldWindow.struct);
    for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
        var mutation = mutations_1[_i];
        var target = childObjects[mutation.target.$id];
        if (!target) {
            throw new Error("Unable to find target for mutation " + mutation.type);
        }
        var mutate = exports.windowMutators[mutation.type];
        if (!mutate) {
            throw new Error("Unable to find window mutator for " + mutation.type);
        }
        mutate(target, mutation);
    }
};
/**
 * Synchronizes IDs between two windows to ensure that future mutations sync
 * properly - seen window mirror impl.
 */
exports.syncWindowIds = function (sourceWindow, targetWindow) {
    var sourceChildObjects = exports.flattenWindowObjectSources(sourceWindow.struct);
    var targetChildObjects = exports.flattenWindowObjectSources(targetWindow.struct);
    var sids = Object.keys(sourceChildObjects);
    var tids = Object.keys(targetChildObjects);
    if (sids.length !== tids.length) {
        throw new Error("child object count missmatch. Cannot synchronize ids");
    }
    // source & target windows should be synchronized, so it should
    // okay to just copy IDs over
    for (var i = 0, n = sids.length; i < n; i++) {
        var sco = sourceChildObjects[sids[i]];
        var nco = targetChildObjects[tids[i]];
        if (sco.$id === nco.$id) {
            continue;
        }
        if (sco.struct.type !== nco.struct.type) {
            throw new Error("Cannot set $id from type " + sco.struct.type + " to type " + nco.struct.type + ".");
        }
        // TODO - assert the type here --- should be identical
        nco.$id = sco.$id;
    }
};
//# sourceMappingURL=window.js.map

/***/ })

})