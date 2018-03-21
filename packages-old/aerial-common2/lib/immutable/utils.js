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
var array_1 = require("./array");
var lodash_1 = require("lodash");
var object_1 = require("./object");
function immutable(value) {
    if (!value || value.$$immutable)
        return value;
    return Array.isArray(value) ? new (array_1.ImmutableArray.bind.apply(array_1.ImmutableArray, [void 0].concat(value.map(immutable))))() :
        value != null && value.constructor === Object ?
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
    else if (typeof map === 'object' && map && map.constructor === Object) {
        var result = immutable(target || {});
        for (var key in map) {
            try {
                result = result.set(key, mapImmutable(result[key], map[key]));
            }
            catch (e) {
                throw e;
            }
        }
        return result;
    }
    else {
        return map;
    }
}
exports.mapImmutable = mapImmutable;
function traverseObject(target, _each) {
    if (Array.isArray(target) || (target && (target.constructor === Object || target.constructor === object_1.ImmutableObject))) {
        lodash_1.each(target, function (value, key, object) {
            if (_each(value, key, object) !== false) {
                traverseObject(value, _each);
            }
        });
    }
}
exports.traverseObject = traverseObject;
function update(object, key, value) {
    if (object[key] === value)
        return object;
    if (Array.isArray(object) && !isNaN(Number(key))) {
        var index = Number(key);
        return object.slice(0, index).concat([value, object.slice(index + 1)]);
    }
    else {
        return __assign({}, object, (_a = {}, _a[key] = value, _a));
    }
    var _a;
}
exports.update = update;
;
exports.shallowClone = function (object) { return Array.isArray(object) ? [].concat(object) : object && (object.constructor === Object || object.constructor === object_1.ImmutableObject) ? __assign({}, object) : object; };
function updateIn(target, path, value) {
    var newTarget = exports.shallowClone(target);
    var current = newTarget;
    var i = 0, n = path.length - 1;
    for (; i < n; i++) {
        current = current[path[i]] = exports.shallowClone(current[path[i]]) || {};
    }
    current[path[i]] = value;
    return newTarget;
}
exports.updateIn = updateIn;
;
exports.arraySplice = function (target, startIndex, deleteCount) {
    var newValues = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        newValues[_i - 3] = arguments[_i];
    }
    return target.slice(0, startIndex).concat(newValues, target.slice(startIndex + deleteCount));
};
exports.arrayReplaceIndex = function (target, index, newItem) { return exports.arraySplice(target, index, 1, newItem); };
exports.arrayReplaceItem = function (target, oldItem, newItem) { return exports.arrayReplaceIndex(target, target.indexOf(oldItem), newItem); };
exports.arrayRemoveIndex = function (target, index) { return exports.arraySplice(target, index, 1); };
exports.arrayRemoveItem = function (target, item) { return exports.arraySplice(target, target.indexOf(item), 1); };
//# sourceMappingURL=utils.js.map