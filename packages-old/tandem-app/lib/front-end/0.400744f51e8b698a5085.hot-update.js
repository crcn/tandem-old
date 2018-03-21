webpackHotUpdate(0,{

/***/ "../slim-dom/lib/diff-patch.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = __webpack_require__("../slim-dom/lib/state.js");
exports.SET_TEXT_NODE_VALUE = "SET_TEXT_NODE_VALUE";
exports.diffNode = function (oldNode, newNode) {
    switch (oldNode.type) {
        case state_1.SlimVMObjectType.TEXT: return diffTextNode(oldNode, newNode);
        default: {
            throw new Error("Unable to diff");
        }
    }
};
var diffTextNode = function (oldNode, newNode) {
};
//# sourceMappingURL=diff-patch.js.map

/***/ })

})