"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
var callEventListener = function (listener, event) {
    if (typeof listener === "function") {
        listener(event);
    }
    else if (listener) {
        listener.handleEvent(event);
    }
    ;
};
exports.getSEnvEventTargetClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvEventTarget = /** @class */ (function () {
        function SEnvEventTarget() {
            this.___eventListeners = {};
        }
        SEnvEventTarget.prototype.addEventListener = function (type, listener, options) {
            if (!this.___eventListeners[type]) {
                this.___eventListeners[type] = listener;
            }
            else if (!Array.isArray(this.___eventListeners[type])) {
                this.___eventListeners[type] = [this.___eventListeners[type], listener];
            }
            else {
                this.___eventListeners[type].push(listener);
            }
        };
        SEnvEventTarget.prototype.dispatchEvent = function (event) {
            var eva = event;
            eva.$currentTarget = this;
            if (!eva.$target) {
                eva.$target = this;
            }
            var listeners = this.___eventListeners[event.type];
            if (!listeners)
                return false;
            if (Array.isArray(listeners)) {
                for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
                    var listener = listeners_1[_i];
                    // -- TODO -- check for stopImmediatePropagation
                    callEventListener(listener, event);
                }
            }
            else {
                callEventListener(listeners, event);
            }
            return true;
        };
        SEnvEventTarget.prototype.removeEventListener = function (type, listener, options) {
            var listeners = this.___eventListeners[type];
            if (!listeners)
                return;
            if (listeners === listener) {
                this.___eventListeners[type] = undefined;
            }
            else if (Array.isArray(listeners)) {
                var index = listeners.indexOf(listener);
                listeners.splice(index, 1);
                if (listeners.length === 1) {
                    this.___eventListeners[type] = listeners[0];
                }
            }
        };
        return SEnvEventTarget;
    }());
    SEnvEventTarget.prototype["___eventListeners"] = {};
    return SEnvEventTarget;
});
//# sourceMappingURL=event-target.js.map