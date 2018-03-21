"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function _ImmutableObject(_a) {
    var _this = __rest(_a, []);
    _this["__proto__"] = this.constructor.prototype;
    return Object.freeze(_this);
}
Object.assign(_ImmutableObject.prototype, {
    $$immutable: true,
    constructor: _ImmutableObject,
    set: function (key, value) {
        return new this.constructor(__assign({}, this, (_a = {}, _a[key] = value, _a)));
        var _a;
    }
});
exports.ImmutableObject = _ImmutableObject;
exports.createImmutableObject = function (properties) { return new exports.ImmutableObject(properties); };
//# sourceMappingURL=object.js.map