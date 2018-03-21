"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
exports.getSEnvTimerClasses = aerial_common2_1.weakMemo(function (context) {
    var SEnvTimers = /** @class */ (function () {
        function SEnvTimers() {
            this._timers = [];
        }
        SEnvTimers.prototype.setTimeout = function (callback, ms) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var timer = setTimeout.apply(void 0, [callback, ms].concat(args));
            this._timers.push(timer);
            return timer;
        };
        SEnvTimers.prototype.clearTimeout = function (timer) {
            clearTimeout(timer);
            this.clearTimer(timer);
        };
        SEnvTimers.prototype.setInterval = function (callback, ms) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var timer = setInterval.apply(void 0, [callback, ms].concat(args));
            this._timers.push(timer);
            return timer;
        };
        SEnvTimers.prototype.clearInterval = function (timer) {
            clearInterval(timer);
            this.clearTimer(timer);
        };
        SEnvTimers.prototype.clearImmediate = function (timer) {
            clearImmediate(timer);
            this.clearTimer(timer);
        };
        SEnvTimers.prototype.clearTimer = function (timer) {
            var index = this._timers.indexOf(timer);
            if (index !== -1) {
                clearTimeout(timer);
                this._timers.splice(index, 1);
            }
        };
        SEnvTimers.prototype.setImmediate = function (callback) {
            var timer = setImmediate(callback);
            this._timers.push(timer);
            return timer;
        };
        SEnvTimers.prototype.dispose = function () {
            for (var i = this._timers.length; i--;) {
                clearInterval(this._timers[i]);
                clearTimeout(this._timers[i]);
                clearImmediate(this._timers[i]);
            }
            this._timers = [];
        };
        return SEnvTimers;
    }());
    return { SEnvTimers: SEnvTimers };
});
//# sourceMappingURL=timers.js.map