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
var constants_1 = require("../constants");
var state_1 = require("../../state");
var node_1 = require("./node");
exports.getSEnvTextClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvValueNode = node_1.getSEnvValueNode(context);
    return /** @class */ (function (_super) {
        __extends(SEnvText, _super);
        function SEnvText() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.nodeType = constants_1.SEnvNodeTypes.TEXT;
            _this.structType = state_1.SYNTHETIC_TEXT_NODE;
            _this.nodeName = "#text";
            return _this;
        }
        Object.defineProperty(SEnvText.prototype, "textContent", {
            get: function () {
                return this.nodeValue;
            },
            set: function (value) {
                this.nodeValue = value;
            },
            enumerable: true,
            configurable: true
        });
        SEnvText.prototype.cloneShallow = function () {
            return this.ownerDocument.createTextNode(this.nodeValue);
        };
        SEnvText.prototype.splitText = function (offset) {
            return null;
        };
        SEnvText.prototype.appendData = function (arg) { };
        SEnvText.prototype.deleteData = function (offset, count) { };
        SEnvText.prototype.insertData = function (offset, arg) { };
        SEnvText.prototype.replaceData = function (offset, count, arg) { };
        SEnvText.prototype.substringData = function (offset, count) {
            return null;
        };
        return SEnvText;
    }(SEnvValueNode));
});
exports.diffTextNode = function (oldNode, newNode) {
    return node_1.diffValueNode(oldNode, newNode);
};
//# sourceMappingURL=text.js.map