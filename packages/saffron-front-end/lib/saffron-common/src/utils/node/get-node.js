"use strict";
function getNode(node, path) {
    var cnode = node;
    for (var i = 0, n = path.length; i < n; i++) {
        cnode = cnode.childNodes[path[i]];
    }
    return cnode;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getNode;
//# sourceMappingURL=get-node.js.map