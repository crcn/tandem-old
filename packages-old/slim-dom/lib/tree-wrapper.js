"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var treeWrapperKey = Symbol();
exports.getTreeWrapper = function (target) {
};
var Tree = /** @class */ (function () {
    function Tree() {
    }
    Tree.prototype.update = function (target) {
        this._target = target;
        if (target.childNodes) {
        }
    };
    return Tree;
}());
//# sourceMappingURL=tree-wrapper.js.map