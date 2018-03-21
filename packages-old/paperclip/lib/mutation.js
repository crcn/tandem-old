"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PC_REMOVE_CHILD_NODE = "PC_REMOVE_CHILD_NODE";
exports.PC_REMOVE_NODE = "PC_REMOVE_NODE";
exports.INSERT_HTML_EDIT = "INSERT_HTML_EDIT";
exports.createPCRemoveChildNodeMutation = function (target, index) { return ({
    type: exports.PC_REMOVE_CHILD_NODE,
    index: index,
    target: target
}); };
exports.createPCRemoveNodeMutation = function (target) { return ({
    type: exports.PC_REMOVE_NODE,
    target: target
}); };
exports.createInsertHTMLMutation = function (target, childIndex, html) { return ({
    type: exports.INSERT_HTML_EDIT,
    html: html,
    childIndex: childIndex,
    target: target
}); };
//# sourceMappingURL=mutation.js.map