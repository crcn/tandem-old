"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var memo_1 = require("../memo");
exports.findTreeNode = function (node, filter) {
    var found;
    exports.walkTree(node, function (node) {
        if (filter(node)) {
            found = node;
            return false;
        }
    });
    return found;
};
exports.getTreeNodeDepth = memo_1.weakMemo(function (child, root) {
    var depth = 0;
    exports.walkTree(root, function (parent) {
        depth++;
        if (parent.childNodes.indexOf(child) !== -1) {
            return false;
        }
    });
    return depth;
});
exports.getTreeNodeParent = memo_1.weakMemo(function (child, root) { return exports.findTreeNode(root, function (node) { return node.childNodes.indexOf(child) !== -1; }); });
exports.walkTree = function (node, eachNode) {
    if (eachNode(node) !== false) {
        node.childNodes.forEach(function (node) { return exports.walkTree(node, eachNode); });
    }
};
//# sourceMappingURL=tree.js.map