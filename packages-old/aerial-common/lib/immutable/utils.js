"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var array_1 = require("./array");
var object_1 = require("./object");
function immutable(value) {
    if (value.$$immutable)
        return value;
    return Array.isArray(value) ? new (array_1.ImmutableArray.bind.apply(array_1.ImmutableArray, [void 0].concat(value.map(immutable))))() :
        typeof value === "object" ?
            new object_1.ImmutableObject(lodash_1.mapValues(value, immutable)) :
            value;
}
exports.immutable = immutable;
function mutable(value) {
    if (!value.$$immutable)
        return value;
    return Array.isArray(value) ? value.map(mutable).slice() :
        typeof value === "object" ?
            lodash_1.mapValues(value, mutable) :
            value;
}
exports.mutable = mutable;
function mapImmutable(target, map) {
    if (typeof map === 'function') {
        return immutable(map(target));
    }
    else if (typeof map === 'object') {
        var result = immutable(target);
        for (var key in map) {
            result = result.set(key, mapImmutable(result[key], map[key]));
        }
        return result;
    }
    else {
        return map;
    }
}
exports.mapImmutable = mapImmutable;
exports.weakMemo = function (TFunc) {
    var memos = new Map();
    var key = Symbol();
    var count = 1;
    return function (arg) {
        var hash = "";
        for (var i = 0, n = arguments.length; i < n; i++) {
            var arg_1 = arguments[i];
            hash += ":" + (arg_1[key] || (arg_1[key] = count++)) && arg_1[key] || arg_1;
        }
        if (memos.has(hash)) {
            return memos.get(hash);
        }
        else {
            var result = TFunc.apply(this, arguments);
            memos.set(hash, result);
            return result;
        }
    };
};
//# sourceMappingURL=utils.js.map