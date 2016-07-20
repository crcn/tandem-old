"use strict";
function default_1(node) {
    var cnode = node;
    var path = [];
    while (cnode.parentNode) {
        path.unshift(Array.prototype.slice.call(cnode.parentNode.childNodes).indexOf(cnode));
        cnode = cnode.parentNode;
    }
    return path;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=get-path.js.map