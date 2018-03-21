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
/**
 * Converts an object into a POJO
 * @param object
 */
exports.serialize = function (object) {
    if (object && typeof object === "object") {
        if (object["$noSerialize"]) {
            return undefined;
        }
        if (object.constructor !== Object && object.constructor !== Array) {
            return undefined;
        }
        if (Array.isArray(object)) {
            return object.map(function (child) { return exports.serialize(child); });
        }
        else {
            var serializableKeysFactory_1 = object["$serializableKeysFactory"];
            var clone = {};
            if (serializableKeysFactory_1) {
                for (var i = serializableKeysFactory_1.length; i--;) {
                    var key = serializableKeysFactory_1[i];
                    clone[key] = exports.serialize(object[key]);
                }
            }
            else {
                for (var key in object) {
                    clone[key] = exports.serialize(object[key]);
                }
            }
            return clone;
        }
    }
    else {
        return object;
    }
};
exports.serializableKeys = function (keys, object) { return (__assign({ $serializableKeysFactory: keys }, object)); };
exports.serializableKeysFactory = function (keys, factory) { return (function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return exports.serializableKeys(keys, factory.apply(void 0, args));
}); };
exports.nonSerializable = function (object) { return (__assign({ $noSerialize: true }, object)); };
exports.nonSerializableFactory = function (create) { return (function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return exports.nonSerializable(create.apply(void 0, args));
}); };
//# sourceMappingURL=serialize.js.map