"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weakMemo = function (fn) {
    var key = Symbol();
    return (function (first) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (first[key])
            return first[key];
        return first[key] = fn.apply(void 0, [first].concat(rest));
    });
};
exports.eachValue = function (items, each) {
    if (Array.isArray(items)) {
        items.forEach(each);
    }
    else {
        for (var key in items) {
            each(items[key], key);
        }
    }
};
exports.isPaperclipFile = function (filePath) { return /pc$/.test(filePath); };
exports.isCSSFile = function (filePath) { return /css$/.test(filePath); };
//# sourceMappingURL=utils.js.map