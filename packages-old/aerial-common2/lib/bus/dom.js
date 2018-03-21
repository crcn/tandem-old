"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var memo_1 = require("../memo");
var lodash_1 = require("lodash");
var base_1 = require("./base");
exports.wrappedEvent = function (type, sourceEvent, map) {
    if (map === void 0) { map = function (event) { return ({}); }; }
    return (__assign({ type: type,
        sourceEvent: sourceEvent }, map(sourceEvent)));
};
exports.wrapEventToDispatch = function (dispatch, createEvent) {
    if (createEvent === void 0) { createEvent = function (event) { return ({}); }; }
    return function (sourceEvent) {
        dispatch(createEvent(__assign({}, sourceEvent)));
    };
};
exports.wrapEventToPublicDispatch = memo_1.weakMemo(function (type, dispatch, map) {
    if (map === void 0) { map = function (event) { return ({}); }; }
    return function (sourceEvent) {
        dispatch(base_1.publicObject(lodash_1.identity)(exports.wrappedEvent(type, sourceEvent)));
    };
});
//# sourceMappingURL=dom.js.map