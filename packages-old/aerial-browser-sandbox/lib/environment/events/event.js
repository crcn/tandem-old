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
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
exports.getSEnvEventClasses = aerial_common2_1.weakMemo(function (context) {
    if (context === void 0) { context = {}; }
    var SEnvEvent = /** @class */ (function () {
        function SEnvEvent() {
            this.defaultPrevented = false;
            this.isTrusted = true;
            this.timeStamp = Date.now();
            this.scoped = false;
        }
        SEnvEvent.prototype.initEvent = function (eventTypeArg, canBubbleArg, cancelableArg) {
            this._type = eventTypeArg;
            this._bubbles = canBubbleArg;
            this._cancelable = cancelableArg;
        };
        Object.defineProperty(SEnvEvent.prototype, "srcElement", {
            get: function () {
                return this.$target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvEvent.prototype, "target", {
            get: function () {
                return this.$target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvEvent.prototype, "currentTarget", {
            get: function () {
                return this.$currentTarget;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvEvent.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvEvent.prototype, "bubbles", {
            get: function () {
                return this._bubbles;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvEvent.prototype, "cancelable", {
            get: function () {
                return this._cancelable;
            },
            enumerable: true,
            configurable: true
        });
        SEnvEvent.prototype.preventDefault = function () {
        };
        SEnvEvent.prototype.stopImmediatePropagation = function () {
        };
        SEnvEvent.prototype.stopPropagation = function () {
        };
        SEnvEvent.prototype.deepPath = function () {
            return [];
        };
        ;
        return SEnvEvent;
    }());
    var SEnvWrapperEvent = /** @class */ (function (_super) {
        __extends(SEnvWrapperEvent, _super);
        function SEnvWrapperEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvWrapperEvent.prototype.init = function (source) {
            _super.prototype.initEvent.call(this, source.type, true, true);
            Object.assign(this, source);
            this.$currentTarget = null;
            this.$target = null;
        };
        return SEnvWrapperEvent;
    }(SEnvEvent));
    var SEnvMutationEvent = /** @class */ (function (_super) {
        __extends(SEnvMutationEvent, _super);
        function SEnvMutationEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvMutationEvent.prototype.initMutationEvent = function (mutation) {
            this.mutation = mutation;
            _super.prototype.initEvent.call(this, SEnvMutationEvent.MUTATION, true, true);
        };
        SEnvMutationEvent.MUTATION = "MUTATION";
        return SEnvMutationEvent;
    }(SEnvEvent));
    var SEnvWindowOpenedEvent = /** @class */ (function (_super) {
        __extends(SEnvWindowOpenedEvent, _super);
        function SEnvWindowOpenedEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvWindowOpenedEvent.prototype.initWindowOpenedEvent = function (window) {
            _super.prototype.initEvent.call(this, SEnvWindowOpenedEvent.WINDOW_OPENED, true, true);
            this.window = window;
        };
        SEnvWindowOpenedEvent.WINDOW_OPENED = "WINDOW_OPENED";
        return SEnvWindowOpenedEvent;
    }(SEnvEvent));
    var SEnvURIChangedEvent = /** @class */ (function (_super) {
        __extends(SEnvURIChangedEvent, _super);
        function SEnvURIChangedEvent(uri) {
            var _this = _super.call(this) || this;
            _this.uri = uri;
            _this.initEvent(SEnvURIChangedEvent.URI_CHANGED, true, true);
            return _this;
        }
        SEnvURIChangedEvent.URI_CHANGED = "URI_CHANGED";
        return SEnvURIChangedEvent;
    }(SEnvEvent));
    var SEnvWindowEvent = /** @class */ (function (_super) {
        __extends(SEnvWindowEvent, _super);
        function SEnvWindowEvent(type) {
            var _this = _super.call(this) || this;
            _this.initEvent(type, true, true);
            return _this;
        }
        SEnvWindowEvent.EXTERNAL_URIS_CHANGED = "EXTERNAL_URIS_CHANGED";
        return SEnvWindowEvent;
    }(SEnvEvent));
    return {
        SEnvEvent: SEnvEvent,
        SEnvWrapperEvent: SEnvWrapperEvent,
        SEnvURIChangedEvent: SEnvURIChangedEvent,
        SEnvWindowEvent: SEnvWindowEvent,
        SEnvMutationEvent: SEnvMutationEvent,
        SEnvWindowOpenedEvent: SEnvWindowOpenedEvent
    };
});
//# sourceMappingURL=event.js.map