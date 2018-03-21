"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeat = function (value, count) {
    var buffer = "";
    for (var i = Math.max(count, 0); i--;) {
        buffer += value;
    }
    return buffer;
};
//# sourceMappingURL=str-utils.js.map