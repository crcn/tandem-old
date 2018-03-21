"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodePath = function (node, root) {
    var path = [];
    var current = node;
    while (current !== root) {
        path.unshift(Array.prototype.indexOf.call(current.parentNode.childNodes, current));
        current = current.parentNode;
    }
    return path;
};
exports.getNodeByPath = function (path, root) {
    var current = root;
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var part = path_1[_i];
        current = current.childNodes[part];
    }
    return current;
};
//# sourceMappingURL=node-utils.js.map