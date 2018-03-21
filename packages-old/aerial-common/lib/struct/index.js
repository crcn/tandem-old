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
var immutable_1 = require("../immutable");
exports.typed = function ($type, factory) {
    return function (props) { return (__assign({}, factory(props), { $type: $type })); };
};
/**
 * Creates an id'd structure
 */
var _idCount = 0;
var generateDefaultId = function (props) { return String(++_idCount); };
exports.idd = function (factory, generateId) {
    if (generateId === void 0) { generateId = generateDefaultId; }
    return function (props) { return (__assign({}, factory(props), { $id: generateDefaultId(props) })); };
};
/**
 * @param type
 */
exports.createImmutableStructFactory = function (type, defaults) { return exports.idd(exports.typed(type, (function (props) {
    if (props === void 0) { props = {}; }
    return immutable_1.mapImmutable(defaults, immutable_1.createImmutableObject(props));
}))); };
//# sourceMappingURL=index.js.map