"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
exports.getSEnvCSSBaseObjectClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvCSSBaseObject = /** @class */ (function () {
        function SEnvCSSBaseObject() {
            this._$id = aerial_common2_1.generateDefaultId();
        }
        Object.defineProperty(SEnvCSSBaseObject.prototype, "$id", {
            get: function () {
                return this._$id;
            },
            set: function (value) {
                this._$id = value;
                this._struct = undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvCSSBaseObject.prototype, "struct", {
            get: function () {
                return this._struct || this.resetStruct();
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSBaseObject.prototype.resetStruct = function () {
            return this._struct = this.$createStruct();
        };
        SEnvCSSBaseObject.prototype.clone = function () {
            var clone = this.cloneDeep();
            clone.source = this.source;
            clone["$id"] = this.$id;
            return clone;
        };
        return SEnvCSSBaseObject;
    }());
    return SEnvCSSBaseObject;
});
//# sourceMappingURL=base.js.map