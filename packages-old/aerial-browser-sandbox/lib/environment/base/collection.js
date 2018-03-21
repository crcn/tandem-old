"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
exports.getSEnvCollection = aerial_common2_1.weakMemo(function (context) {
    var _Collection = function () {
        var _this = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _this[_i] = arguments[_i];
        }
        _this["__proto__"] = this.constructor.prototype;
        return _this;
    };
    _Collection.prototype = [];
    return _Collection;
});
//# sourceMappingURL=collection.js.map