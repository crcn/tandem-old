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
var aerial_common2_1 = require("aerial-common2");
var parent_node_1 = require("./parent-node");
var constants_1 = require("../constants");
exports.getSEnvDocumentFragment = aerial_common2_1.weakMemo(function (context) {
    var SEnvParentNode = parent_node_1.getSEnvParentNodeClass(context);
    return /** @class */ (function (_super) {
        __extends(SEnvDocumentFragment, _super);
        function SEnvDocumentFragment() {
            var _this = _super.call(this) || this;
            _this.nodeType = constants_1.SEnvNodeTypes.DOCUMENT_FRAGMENT;
            _this.nodeName = "#document-fragment";
            return _this;
        }
        SEnvDocumentFragment.prototype.getElementById = function (elementId) {
            return this.querySelector("#" + elementId);
        };
        SEnvDocumentFragment.prototype.cloneShallow = function () {
            var clone = this.ownerDocument.createDocumentFragment();
            return clone;
        };
        return SEnvDocumentFragment;
    }(SEnvParentNode));
});
//# sourceMappingURL=fragment.js.map