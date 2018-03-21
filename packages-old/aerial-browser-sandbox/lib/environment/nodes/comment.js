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
var node_1 = require("./node");
var state_1 = require("../../state");
exports.getSEnvCommentClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvValueNode = node_1.getSEnvValueNode(context);
    return /** @class */ (function (_super) {
        __extends(SEnvComment, _super);
        function SEnvComment() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.nodeType = constants_1.SEnvNodeTypes.COMMENT;
            _this.structType = state_1.SYNTHETIC_COMMENT;
            _this.nodeName = "#comment";
            return _this;
        }
        Object.defineProperty(SEnvComment.prototype, "data", {
            get: function () {
                return this.nodeValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvComment.prototype, "text", {
            get: function () {
                return this.nodeValue;
            },
            enumerable: true,
            configurable: true
        });
        SEnvComment.prototype.cloneShallow = function () {
            var clone = this.ownerDocument.createComment(this.nodeValue);
            return clone;
        };
        SEnvComment.prototype.appendData = function (arg) { };
        SEnvComment.prototype.deleteData = function (offset, count) { };
        SEnvComment.prototype.insertData = function (offset, arg) { };
        SEnvComment.prototype.replaceData = function (offset, count, arg) { };
        SEnvComment.prototype.substringData = function (offset, count) {
            return null;
        };
        return SEnvComment;
    }(SEnvValueNode));
});
exports.diffComment = function (oldComment, newComment) {
    return node_1.diffValueNode(oldComment, newComment);
};
//# sourceMappingURL=comment.js.map