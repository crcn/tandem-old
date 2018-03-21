"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.once = function (fn) {
    var _called = false;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (_called)
            return;
        _called = true;
        return fn.apply(void 0, args);
    };
};
//# sourceMappingURL=once.js.map