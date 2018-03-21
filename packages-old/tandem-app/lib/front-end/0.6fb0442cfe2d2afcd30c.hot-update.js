webpackHotUpdate(0,{

/***/ "../aerial-browser-sandbox/lib/environment/renderers/base.js":
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
var events_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/events/index.js");
var EventTarget = events_1.getSEnvEventTargetClass();
var _a = events_1.getSEnvEventClasses(), SEnvEvent = _a.SEnvEvent, SEnvMutationEvent = _a.SEnvMutationEvent;
;
;
var SyntheticWindowRendererEvent = /** @class */ (function (_super) {
    __extends(SyntheticWindowRendererEvent, _super);
    function SyntheticWindowRendererEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticWindowRendererEvent.prototype.initRendererEvent = function (type, rects, styles, scrollRect, scrollPosition) {
        _super.prototype.initEvent.call(this, type, true, true);
        this.rects = rects;
        this.styles = styles;
        this.scrollRect = scrollRect;
        this.scrollPosition = scrollPosition;
    };
    SyntheticWindowRendererEvent.PAINTED = "PAINTED";
    return SyntheticWindowRendererEvent;
}(SEnvEvent));
exports.SyntheticWindowRendererEvent = SyntheticWindowRendererEvent;
var SyntheticWindowRendererNativeEvent = /** @class */ (function (_super) {
    __extends(SyntheticWindowRendererNativeEvent, _super);
    function SyntheticWindowRendererNativeEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticWindowRendererNativeEvent.prototype.init = function (type, targetNodeId, event) {
        _super.prototype.initEvent.call(this, type, true, true);
        this.targetNodeId = targetNodeId;
        this.nativeEvent = event;
    };
    SyntheticWindowRendererNativeEvent.NATIVE_EVENT = "NATIVE_EVENT";
    return SyntheticWindowRendererNativeEvent;
}(SEnvEvent));
exports.SyntheticWindowRendererNativeEvent = SyntheticWindowRendererNativeEvent;
var REQUEST_UPDATE_TIMEOUT = 50;
var BaseSyntheticWindowRenderer = /** @class */ (function (_super) {
    __extends(BaseSyntheticWindowRenderer, _super);
    function BaseSyntheticWindowRenderer(_sourceWindow) {
        var _this = _super.call(this) || this;
        _this._sourceWindow = _sourceWindow;
        _this._id = Math.random();
        _this._runningPromise = Promise.resolve();
        _this._onDocumentLoad = _this._onDocumentLoad.bind(_this);
        _this._onDocumentReadyStateChange = _this._onDocumentReadyStateChange.bind(_this);
        _this._onWindowResize = _this._onWindowResize.bind(_this);
        _this._onWindowScroll = _this._onWindowScroll.bind(_this);
        _this._onWindowMutation = _this._onWindowMutation.bind(_this);
        _this._addTargetListeners();
        _this.reset();
        return _this;
    }
    Object.defineProperty(BaseSyntheticWindowRenderer.prototype, "allBoundingClientRects", {
        get: function () {
            return this._rects;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticWindowRenderer.prototype, "clientRects", {
        get: function () {
            return this._rects;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticWindowRenderer.prototype, "computedStyles", {
        get: function () {
            return this._styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticWindowRenderer.prototype, "scrollRect", {
        get: function () {
            return this._scrollRect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticWindowRenderer.prototype, "scrollPosition", {
        get: function () {
            return this._scrollPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticWindowRenderer.prototype, "sourceWindow", {
        get: function () {
            return this._sourceWindow;
        },
        enumerable: true,
        configurable: true
    });
    BaseSyntheticWindowRenderer.prototype.getBoundingClientRect = function (element) {
        return this._rects && this._rects[element.$id];
    };
    BaseSyntheticWindowRenderer.prototype.getComputedStyle = function (element, pseudoElement) {
        return this._styles && this._styles[element.$id];
    };
    BaseSyntheticWindowRenderer.prototype._removeTargetListeners = function () {
    };
    BaseSyntheticWindowRenderer.prototype.dispose = function () {
        this._disposed = true;
        this._sourceWindow.document.removeEventListener("readystatechange", this._onDocumentReadyStateChange);
        this._sourceWindow.removeEventListener("resize", this._onWindowResize);
        this._sourceWindow.removeEventListener("scroll", this._onWindowScroll);
        this._sourceWindow.removeEventListener(SEnvMutationEvent.MUTATION, this._onWindowMutation);
    };
    BaseSyntheticWindowRenderer.prototype._addTargetListeners = function () {
        this._sourceWindow.document.addEventListener("readystatechange", this._onDocumentReadyStateChange);
        this._sourceWindow.addEventListener("resize", this._onWindowResize);
        this._sourceWindow.addEventListener("scroll", this._onWindowScroll);
    };
    BaseSyntheticWindowRenderer.prototype.start = function () {
        if (this._started || this._disposed) {
            return;
        }
        this._started = true;
        this.requestRender();
        // document load is when the page is visible to the user, so only listen for 
        // mutations after stuff is loaded in (They'll be fired as the document is loaded in) (CC)
        this._sourceWindow.addEventListener(SEnvMutationEvent.MUTATION, this._onWindowMutation);
    };
    BaseSyntheticWindowRenderer.prototype._onDocumentReadyStateChange = function (event) {
        if (this._sourceWindow.document.readyState === "complete") {
            this._onDocumentLoad(event);
        }
    };
    BaseSyntheticWindowRenderer.prototype.whenRunning = function () {
        return this._runningPromise;
    };
    BaseSyntheticWindowRenderer.prototype.resume = function () {
        if (this._resolveRunningPromise) {
            var resolve = this._resolveRunningPromise;
            this._resolveRunningPromise = undefined;
            resolve();
        }
    };
    BaseSyntheticWindowRenderer.prototype.pause = function () {
        var _this = this;
        if (!this._resolveRunningPromise) {
            this._runningPromise = new Promise(function (resolve) {
                _this._resolveRunningPromise = resolve;
            });
        }
    };
    BaseSyntheticWindowRenderer.prototype._onDocumentLoad = function (event) {
        this.reset();
        this.requestRender();
    };
    BaseSyntheticWindowRenderer.prototype.requestRender = function () {
        var _this = this;
        if (!this._sourceWindow)
            return;
        if (this._currentRenderPromise) {
            this._shouldRenderAgain = true;
        }
        return this._currentRenderPromise || (this._currentRenderPromise = new Promise(function (resolve, reject) {
            var done = function () {
                _this._currentRenderPromise = undefined;
            };
            // renderer here doesn't need to be particularly fast since the user
            // doesn't get to interact with visual content. Provide a slowish
            // timeout to ensure that we don't kill CPU from unecessary renders.
            var render = function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this._sourceWindow || this._disposed)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.whenRunning()];
                        case 1:
                            _a.sent();
                            this._shouldRenderAgain = false;
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, _this.getRequestUpdateTimeout()); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.render()];
                        case 3:
                            _a.sent();
                            if (!this._shouldRenderAgain) return [3 /*break*/, 5];
                            this._shouldRenderAgain = false;
                            return [4 /*yield*/, render()];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            }); };
            render().then(resolve, reject).then(done, done);
        }));
    };
    BaseSyntheticWindowRenderer.prototype.reset = function () {
    };
    BaseSyntheticWindowRenderer.prototype._onWindowResize = function (event) {
        this.requestRender();
    };
    BaseSyntheticWindowRenderer.prototype._onWindowScroll = function (event) {
        this.requestRender();
    };
    BaseSyntheticWindowRenderer.prototype._onWindowMutation = function (event) {
        this.requestRender();
    };
    BaseSyntheticWindowRenderer.prototype.getRequestUpdateTimeout = function () {
        // OVERRIDE ME - used for dynamic render throttling
        return REQUEST_UPDATE_TIMEOUT;
    };
    BaseSyntheticWindowRenderer.prototype.setPaintedInfo = function (rects, styles, scrollRect, scrollPosition) {
        console.log("SPAINT", this._id);
        this._rects = rects;
        this._styles = styles;
        this._scrollRect = scrollRect;
        this._scrollPosition = scrollPosition;
        var event = new SyntheticWindowRendererEvent();
        event.initRendererEvent(SyntheticWindowRendererEvent.PAINTED, rects, styles, scrollRect, scrollPosition);
        this.dispatchEvent(event);
    };
    return BaseSyntheticWindowRenderer;
}(EventTarget));
exports.BaseSyntheticWindowRenderer = BaseSyntheticWindowRenderer;
//# sourceMappingURL=base.js.map

/***/ })

})