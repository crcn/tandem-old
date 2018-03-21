webpackHotUpdate(0,{

/***/ "../slim-dom/lib/diff-patch.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = __webpack_require__("../slim-dom/lib/state.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var compression_1 = __webpack_require__("../slim-dom/lib/compression.js");
var utils_1 = __webpack_require__("../slim-dom/lib/utils.js");
// text
exports.SET_TEXT_NODE_VALUE = "SET_TEXT_NODE_VALUE";
// parent node
exports.INSERT_CHILD_NODE = "INSERT_CHILD_NODE";
exports.REMOVE_CHILD_NODE = "REMOVE_CHILD_NODE";
// elements
exports.SET_ATTRIBUTE_VALUE = "SET_ATTRIBUTE_VALUE";
exports.ATTACH_SHADOW = "ATTACH_SHADOW";
exports.REMOVE_SHADOW = "REMOVE_SHADOW";
exports.diffNode = utils_1.weakMemo(function (oldNode, newNode) {
    switch (oldNode.type) {
        case state_1.SlimVMObjectType.TEXT: return diffTextNode(oldNode, newNode);
        case state_1.SlimVMObjectType.ELEMENT: return diffElement(oldNode, newNode);
        case state_1.SlimVMObjectType.DOCUMENT:
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT: return diffDocumentFragment(oldNode, newNode);
        default: {
            throw new Error("Unable to diff");
        }
    }
});
var diffTextNode = function (oldNode, newNode) {
    if (oldNode.value !== newNode.value) {
        return [source_mutation_1.createSetValueMutation(exports.SET_TEXT_NODE_VALUE, oldNode.id, newNode.value)];
    }
};
var diffElement = function (oldElement, newElement) {
    var diffs = [];
    source_mutation_1.eachArrayValueMutation(source_mutation_1.diffArray(oldElement.attributes, newElement.attributes, function (a, b) { return a.name === b.name ? 0 : -1; }), {
        insert: function (_a) {
            var index = _a.index, value = _a.value;
            diffs.push(source_mutation_1.createPropertyMutation(exports.SET_ATTRIBUTE_VALUE, oldElement.id, value.name, value.value));
        },
        delete: function (_a) {
            var index = _a.index, value = _a.value;
            diffs.push(source_mutation_1.createPropertyMutation(exports.SET_ATTRIBUTE_VALUE, oldElement.id, value.name, null));
        },
        update: function (_a) {
            var index = _a.index, newValue = _a.newValue, originalOldIndex = _a.originalOldIndex;
            if (newValue.value !== oldElement.attributes[originalOldIndex].value) {
                diffs.push(source_mutation_1.createPropertyMutation(exports.SET_ATTRIBUTE_VALUE, oldElement.id, newValue.name, newValue.value));
            }
        }
    });
    diffs.push.apply(diffs, diffChildNodes(oldElement, newElement));
    if (oldElement.shadow && newElement.shadow) {
        diffs.push.apply(diffs, diffDocumentFragment(oldElement.shadow, newElement.shadow));
    }
    else if (oldElement.shadow && !newElement.shadow) {
        diffs.push(source_mutation_1.createSetValueMutation(exports.REMOVE_SHADOW, oldElement.id, null));
    }
    else if (!oldElement.shadow && newElement.shadow) {
        diffs.push(source_mutation_1.createSetValueMutation(exports.ATTACH_SHADOW, oldElement.id, compression_1.compressRootNode(newElement.shadow)));
    }
    return diffs;
};
var diffDocumentFragment = function (oldParent, newParent) {
    return diffChildNodes(oldParent, newParent);
};
var diffChildNodes = function (oldParent, newParent) {
    var diffs = [];
    source_mutation_1.eachArrayValueMutation(source_mutation_1.diffArray(oldParent.childNodes, newParent.childNodes, compareNodeDiffs), {
        insert: function (_a) {
            var index = _a.index, value = _a.value;
            diffs.push(source_mutation_1.createInsertChildMutation(exports.INSERT_CHILD_NODE, oldParent.id, compression_1.compressRootNode(value)));
        },
        delete: function (_a) {
            var index = _a.index, value = _a.value;
            diffs.push(source_mutation_1.createRemoveChildMutation(exports.REMOVE_CHILD_NODE, oldParent.id, null, index));
        },
        update: function (_a) {
            var index = _a.index, newValue = _a.newValue, originalOldIndex = _a.originalOldIndex;
            diffs.push.apply(diffs, exports.diffNode(oldParent.childNodes[originalOldIndex], newValue));
        }
    });
    return diffs;
};
var compareNodeDiffs = function (a, b) {
    if (a.type !== b.type) {
        return -1;
    }
    if (a.type === state_1.SlimVMObjectType.ELEMENT) {
        // if the tag names are not the same, then return no match
        if (a.tagName !== b.tagName) {
            return -1;
        }
        // return identical match for now
        return 0;
    }
    if (a.type === state_1.SlimVMObjectType.TEXT) {
        return a.value === b.value ? 0 : 1;
    }
    return 0;
};
exports.patchNode = function (root, diffs) {
    for (var i = 0, length_1 = diffs.length; i < length_1; i++) {
        var diff = diffs[i];
        var info = utils_1.flattenObjects(root)[diff.target];
        if (!info) {
            throw new Error("diff " + JSON.stringify(diff) + " doesn't have a matching node.");
        }
        var target = info.value;
        var newTarget = target;
        switch (diff.type) {
            case exports.SET_TEXT_NODE_VALUE: {
                var newValue = diff.newValue;
                newTarget = utils_1.setTextNodeValue(target, newValue);
                break;
            }
            case exports.SET_ATTRIBUTE_VALUE: {
                var _a = diff, name_1 = _a.name, newValue = _a.newValue;
                newTarget = utils_1.setElementAttribute(target, name_1, newValue);
                break;
            }
            case exports.REMOVE_CHILD_NODE: {
                var index = diff.index;
                newTarget = utils_1.removeChildNodeAt(newTarget, index);
                break;
            }
            case exports.INSERT_CHILD_NODE: {
                var _b = diff, index = _b.index, child = _b.child;
                newTarget = utils_1.insertChildNode(newTarget, compression_1.uncompressRootNode(child), index);
                break;
            }
        }
        if (newTarget !== target) {
            root = utils_1.replaceNestedChild(root, utils_1.getNodePath(target, root), newTarget);
        }
    }
    return root;
};
//# sourceMappingURL=diff-patch.js.map

/***/ })

})