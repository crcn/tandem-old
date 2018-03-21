"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ArrayCollection = /** @class */ (function (_super) {
    __extends(_ArrayCollection, _super);
    function _ArrayCollection() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return _super.apply(this, items) || this;
    }
    return _ArrayCollection;
}(Array));
function __ArrayCollection() {
    var _this = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _this[_i] = arguments[_i];
    }
    _this["__proto__"] = this.constructor.prototype;
    return _this;
}
__ArrayCollection.prototype = [];
exports.ArrayCollection = __ArrayCollection;
//# sourceMappingURL=index.js.map