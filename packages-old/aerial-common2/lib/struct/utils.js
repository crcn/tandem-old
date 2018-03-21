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
var memo_1 = require("../memo");
exports.typed = function ($type, factory) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __assign({}, factory.apply(void 0, args), { $type: $type });
    };
};
/**
 * Creates an id'd structure
 */
var _idCount = 0;
var ID_SEED = Math.round(Math.random() * 9999);
exports.generateDefaultId = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return ID_SEED + "." + String(++_idCount);
};
exports.idd = function (factory, generateId) {
    if (generateId === void 0) { generateId = exports.generateDefaultId; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __assign({ $id: exports.generateDefaultId.apply(void 0, args) }, factory.apply(void 0, args));
    };
};
/**
 */
var pathIdFilter = memo_1.weakMemo(function (id) { return function (value) { return value && value.$id === id; }; });
/**
 * @param type
 */
exports.structFactory = function (type, create) {
    return exports.idd(exports.typed(type, create));
};
exports.struct = function (type, props) { return exports.idd(exports.typed(type, function () { return props; }))(); };
/**
 * @param type
 */
exports.createImmutableStructFactory = function (type, defaults) {
    if (defaults === void 0) { defaults = {}; }
    return exports.idd(exports.typed(type, (function (props) {
        if (props === void 0) { props = {}; }
        return immutable_1.mapImmutable(defaults, props);
    })));
};
exports.createStructFactory = function (type, defaults) {
    if (defaults === void 0) { defaults = {}; }
    return exports.idd(exports.typed(type, (function (props) {
        if (props === void 0) { props = {}; }
        return Object.assign(JSON.parse(JSON.stringify(defaults)), props);
    })));
};
exports.getReferenceString = function (_a) {
    var $id = _a.$id, $type = _a.$type;
    return $type + ":" + $id;
};
exports.getStructReference = function (_a) {
    var $id = _a.$id, $type = _a.$type;
    return [$type, $id];
};
//# sourceMappingURL=utils.js.map