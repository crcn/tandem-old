"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paperclip_1 = require("paperclip");
exports.getExpressionAtPosition = function (pos, ast, filter) {
    if (filter === void 0) { filter = function () { return true; }; }
    var found;
    paperclip_1.traversePCAST(ast, function (child) {
        if (pos >= child.location.start.pos && pos < child.location.end.pos && filter(child)) {
            found = child;
        }
    });
    return found;
};
exports.getAncestors = function (ast, root) {
    var pcm = setChildParentMap(root, new Map());
    var p = pcm.get(ast);
    var ancestors = [];
    while (p) {
        ancestors.push(p);
        p = pcm.get(p);
    }
    return ancestors;
};
var setChildParentMap = function (parent, map) {
    if (parent.type === paperclip_1.PCExpressionType.FRAGMENT || parent.type === paperclip_1.PCExpressionType.ELEMENT) {
        var parent2 = parent;
        for (var i = 0, length_1 = parent2.childNodes.length; i < length_1; i++) {
            var child = parent2.childNodes[i];
            map.set(child, parent2);
            setChildParentMap(child, map);
        }
    }
    return map;
};
exports.exprLocationToRange = function (location) {
    return {
        start: {
            line: location.start.line - 1,
            character: location.start.column
        },
        end: {
            line: location.end.line - 1,
            character: location.end.column
        },
    };
};
//# sourceMappingURL=utils.js.map