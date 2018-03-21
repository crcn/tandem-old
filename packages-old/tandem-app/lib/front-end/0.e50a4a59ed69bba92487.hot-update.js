webpackHotUpdate(0,{

/***/ "../slim-dom/lib/diff-patch.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = __webpack_require__("../slim-dom/lib/state.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
// text
exports.SET_TEXT_NODE_VALUE = "SET_TEXT_NODE_VALUE";
// elements
exports.SET_ATTRIBUTE_VALUE = "SET_ATTRIBUTE_VALUE";
exports.diffNode = function (oldNode, newNode) {
    switch (oldNode.type) {
        case state_1.SlimVMObjectType.TEXT: return diffTextNode(oldNode, newNode);
        case state_1.SlimVMObjectType.ELEMENT: return diffElement(oldNode, newNode);
        default: {
            throw new Error("Unable to diff");
        }
    }
};
var diffTextNode = function (oldNode, newNode) {
    if (oldNode.value !== newNode.value) {
        return [source_mutation_1.createSetValueMutation(exports.SET_TEXT_NODE_VALUE, oldNode.source, newNode.value)];
    }
};
var diffElement = function (oldElement, newElement) {
    var diffs = [];
    diffs.push.apply(diffs, source_mutation_1.diffArray(oldElement.attributes, newElement.attributes, function (a, b) { return a.name === b.name ? 0 : -1; }).mutations.map(function (mutation) {
        switch (mutation.type) {
            case source_mutation_1.ARRAY_INSERT: {
                return source_mutation_1.createPropertyMutation(exports.SET_ATTRIBUTE_VALUE, oldElement.source, mutation.target.name, mutation.value.value);
            }
            case source_mutation_1.ARRAY_DELETE: {
                return source_mutation_1.createPropertyMutation(exports.SET_ATTRIBUTE_VALUE, oldElement.source, oldElement.attributes[mutation.index].name, undefined);
            }
            case source_mutation_1.ARRAY_UPDATE: {
                if (mutation.newValue.value !== oldElement.attributes[mutation.originalOldIndex].value) {
                    return source_mutation_1.createPropertyMutation(exports.SET_ATTRIBUTE_VALUE, oldElement.source, oldElement.attributes[mutation.originalOldIndex].name, mutation.newValue.value);
                }
            }
        }
    }).filter(Boolean));
    return diffs;
};
//# sourceMappingURL=diff-patch.js.map

/***/ })

})