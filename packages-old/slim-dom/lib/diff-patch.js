"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./state");
var source_mutation_1 = require("source-mutation");
var compression_1 = require("./compression");
var utils_1 = require("./utils");
var lodash_1 = require("lodash");
var crc32 = require("crc32");
// text
exports.SET_TEXT_NODE_VALUE = "SET_TEXT_NODE_VALUE";
// parent node
exports.INSERT_CHILD_NODE = "INSERT_CHILD_NODE";
exports.REMOVE_CHILD_NODE = "REMOVE_CHILD_NODE";
exports.MOVE_CHILD_NODE = "MOVE_CHILD_NODE";
// elements
exports.SET_ATTRIBUTE = "SET_ATTRIBUTE";
exports.REMOVE_ATTRIBUTE = "REMOVE_ATTRIBUTE";
exports.INSERT_ATTRIBUTE = "INSERT_ATTRIBUTE";
exports.ATTACH_SHADOW = "ATTACH_SHADOW";
exports.REMOVE_SHADOW = "REMOVE_SHADOW";
exports.MOVE_ATTRIBUTE = "MOVE_ATTRIBUTE";
// CSS Grouping
exports.CSS_INSERT_RULE = "CSS_INSERT_RULE";
exports.CSS_DELETE_RULE = "CSS_DELETE_RULE";
exports.CSS_MOVE_RULE = "CSS_MOVE_RULE";
// CSS Style Rule
exports.CSS_INSERT_STYLE_PROPERTY = "CSS_INSERT_STYLE_PROPERTY";
exports.CSS_SET_STYLE_PROPERTY = "CSS_SET_STYLE_PROPERTY";
exports.CSS_MOVE_STYLE_PROPERTY = "CSS_MOVE_STYLE_PROPERTY";
exports.CSS_DELETE_STYLE_PROPERTY = "CSS_DELETE_STYLE_PROPERTY";
exports.CSS_SET_SELECTOR_TEXT = "CSS_SET_SELECTOR_TEXT";
// CSS At Rule
exports.CSS_AT_RULE_SET_PARAMS = "CSS_AT_RULE_SET_PARAMS";
exports.diffNode = utils_1.weakMemo(function (oldNode, newNode, path) {
    if (path === void 0) { path = []; }
    switch (oldNode.type) {
        case state_1.SlimVMObjectType.TEXT: return diffTextNode(oldNode, newNode, path);
        case state_1.SlimVMObjectType.ELEMENT: return diffElement(oldNode, newNode, path);
        case state_1.SlimVMObjectType.DOCUMENT:
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT: return diffDocumentFragment(oldNode, newNode, path);
        default: {
            throw new Error("Unable to diff");
        }
    }
});
var diffTextNode = function (oldNode, newNode, path) {
    if (oldNode.value !== newNode.value) {
        return [source_mutation_1.createSetValueMutation(exports.SET_TEXT_NODE_VALUE, path, newNode.value)];
    }
};
var diffElement = function (oldElement, newElement, path) {
    var diffs = [];
    source_mutation_1.eachArrayValueMutation(source_mutation_1.diffArray(oldElement.attributes, newElement.attributes, function (a, b) {
        if (a.name === b.name) {
            return 0;
        }
        return -1;
    }), {
        insert: function (_a) {
            var index = _a.index, value = _a.value;
            diffs.push(source_mutation_1.createPropertyMutation(exports.INSERT_ATTRIBUTE, path, value.name, value.value, null, null, index));
        },
        delete: function (_a) {
            var index = _a.index, value = _a.value;
            diffs.push(source_mutation_1.createPropertyMutation(exports.REMOVE_ATTRIBUTE, path, value.name, null, null, null, index));
        },
        update: function (_a) {
            var index = _a.index, newValue = _a.newValue, originalOldIndex = _a.originalOldIndex, patchedOldIndex = _a.patchedOldIndex;
            var oldAttrValue = oldElement.attributes[originalOldIndex].value;
            if (index !== patchedOldIndex) {
                diffs.push(source_mutation_1.createMoveChildMutation(exports.MOVE_ATTRIBUTE, path, null, index, patchedOldIndex));
            }
            if (!lodash_1.isEqual(newValue.value, oldAttrValue)) {
                diffs.push(source_mutation_1.createPropertyMutation(exports.SET_ATTRIBUTE, path, newValue.name, newValue.value, null, null, index));
            }
        }
    });
    if (oldElement.tagName === "style") {
        diffs.push.apply(diffs, diffCSSRule(oldElement.sheet, newElement.sheet, path.concat(["sheet"])));
    }
    diffs.push.apply(diffs, diffChildNodes(oldElement, newElement, path));
    if (oldElement.shadow && newElement.shadow) {
        diffs.push.apply(diffs, diffDocumentFragment(oldElement.shadow, newElement.shadow, path.concat(["shadow"])));
    }
    else if (oldElement.shadow && !newElement.shadow) {
        diffs.push(source_mutation_1.createSetValueMutation(exports.REMOVE_SHADOW, path, null));
    }
    else if (!oldElement.shadow && newElement.shadow) {
        diffs.push(source_mutation_1.createSetValueMutation(exports.ATTACH_SHADOW, path, compression_1.compressRootNode(newElement.shadow)));
    }
    return diffs;
};
var diffDocumentFragment = function (oldParent, newParent, path) {
    return diffChildNodes(oldParent, newParent, path);
};
var diffChildNodes = function (oldParent, newParent, path) {
    var diffs = [];
    source_mutation_1.eachArrayValueMutation(source_mutation_1.diffArray(oldParent.childNodes, newParent.childNodes, compareNodeDiffs), {
        insert: function (_a) {
            var index = _a.index, value = _a.value;
            diffs.push(source_mutation_1.createInsertChildMutation(exports.INSERT_CHILD_NODE, path, compression_1.compressRootNode(value), index));
        },
        delete: function (_a) {
            var index = _a.index, value = _a.value;
            diffs.push(source_mutation_1.createRemoveChildMutation(exports.REMOVE_CHILD_NODE, path, null, index));
        },
        update: function (_a) {
            var index = _a.index, newValue = _a.newValue, originalOldIndex = _a.originalOldIndex, patchedOldIndex = _a.patchedOldIndex;
            if (index !== patchedOldIndex) {
                diffs.push(source_mutation_1.createMoveChildMutation(exports.MOVE_CHILD_NODE, path, null, index, patchedOldIndex));
            }
            diffs.push.apply(diffs, exports.diffNode(oldParent.childNodes[originalOldIndex], newValue, path.concat([index])));
        }
    });
    return diffs;
};
var diffCSSRule = function (oldRule, newRule, path) {
    switch (oldRule.type) {
        case state_1.SlimVMObjectType.STYLE_SHEET: return diffCSSStyleSheet(oldRule, newRule, path);
        case state_1.SlimVMObjectType.STYLE_RULE: return diffCSSStyleRule(oldRule, newRule, path);
        case state_1.SlimVMObjectType.AT_RULE: return diffCSSAtRule(oldRule, newRule, path);
    }
    return [];
};
var diffCSSStyleSheet = function (oldSheet, newSheet, path) {
    return diffCSSGroupingRuleChildren(oldSheet, newSheet, path);
};
var diffCSSStyleRule = function (oldRule, newRule, path) {
    var diffs = [];
    if (oldRule.selectorText !== newRule.selectorText) {
        diffs.push(source_mutation_1.createSetValueMutation(exports.CSS_SET_SELECTOR_TEXT, path, newRule.selectorText));
    }
    source_mutation_1.eachArrayValueMutation(source_mutation_1.diffArray(oldRule.style, newRule.style, function (a, b) { return a.name === b.name ? 0 : -1; }), {
        insert: function (_a) {
            var index = _a.index, value = _a.value;
            diffs.push(source_mutation_1.createPropertyMutation(exports.CSS_INSERT_STYLE_PROPERTY, path, value.name, value.value, null, null, index));
        },
        delete: function (_a) {
            var index = _a.index, value = _a.value;
            diffs.push(source_mutation_1.createPropertyMutation(exports.CSS_DELETE_STYLE_PROPERTY, path, value.name, null, null, null, index));
        },
        update: function (_a) {
            var newValue = _a.newValue, index = _a.index, patchedOldIndex = _a.patchedOldIndex, originalOldIndex = _a.originalOldIndex;
            if (patchedOldIndex !== index) {
                diffs.push(source_mutation_1.createMoveChildMutation(exports.CSS_MOVE_STYLE_PROPERTY, path, newValue, index, patchedOldIndex));
            }
            // TODO - move style attribute
            if (newRule.style[index].value !== oldRule.style[originalOldIndex].value) {
                diffs.push(source_mutation_1.createPropertyMutation(exports.CSS_SET_STYLE_PROPERTY, path, newValue.name, newValue.value, oldRule.style[originalOldIndex].name, oldRule.style[originalOldIndex].value, index));
            }
        }
    });
    return diffs;
};
var diffCSSAtRule = function (oldRule, newRule, path) {
    var diffs = [];
    if (oldRule.params !== newRule.params) {
        diffs.push(source_mutation_1.createSetValueMutation(exports.CSS_AT_RULE_SET_PARAMS, path, newRule.params));
    }
    diffs.push.apply(diffs, diffCSSGroupingRuleChildren(oldRule, newRule, path));
    return diffs;
};
var diffCSSGroupingRuleChildren = function (oldRule, newRule, path) {
    var diffs = [];
    source_mutation_1.eachArrayValueMutation(source_mutation_1.diffArray(oldRule.rules, newRule.rules, compareCSSRules), {
        insert: function (_a) {
            var index = _a.index, value = _a.value;
            diffs.push(source_mutation_1.createInsertChildMutation(exports.CSS_INSERT_RULE, path, compression_1.compressRootNode(value), index));
        },
        delete: function (_a) {
            var index = _a.index;
            diffs.push(source_mutation_1.createRemoveChildMutation(exports.CSS_DELETE_RULE, path, null, index));
        },
        update: function (_a) {
            var newValue = _a.newValue, originalOldIndex = _a.originalOldIndex, index = _a.index, patchedOldIndex = _a.patchedOldIndex;
            if (index !== patchedOldIndex) {
                diffs.push(source_mutation_1.createMoveChildMutation(exports.CSS_MOVE_RULE, path, null, index, patchedOldIndex));
            }
            diffs.push.apply(diffs, diffCSSRule(oldRule.rules[originalOldIndex], newValue, path.concat([index])));
        }
    });
    return diffs;
};
var compareCSSRules = function (a, b) {
    if (a.type !== b.type) {
        return -1;
    }
    if (a.type === state_1.SlimVMObjectType.STYLE_RULE) {
        return a.selectorText === b.selectorText ? 0 : 1;
    }
    if (a.type === state_1.SlimVMObjectType.AT_RULE) {
        var ar = a;
        var br = b;
        if (ar.name !== br.name) {
            return -1;
        }
        return ar.params === br.params ? 0 : 1;
    }
    // TODO - check media
    return 1;
};
var compareNodeDiffs = function (a, b) {
    if (a.type !== b.type) {
        return -1;
    }
    if (a.type === state_1.SlimVMObjectType.ELEMENT) {
        var ae = a;
        var ab = b;
        // if the tag names are not the same, then return no match
        if (ae.tagName !== ab.tagName) {
            return -1;
        }
        // compare non-standard scope prop on style element. Scope is the tag name where the style is applied to. 
        if (ae.tagName === "style" && utils_1.getAttributeValue("scope", ae) !== utils_1.getAttributeValue("scope", ab)) {
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
exports.prepDiff = function (root, diffs) {
    var idSeed = root.id ? crc32(utils_1.getDocumentChecksum(root) + root.id) : null;
    var refCount = 0;
    return diffs.map(function (diff) {
        switch (diff.type) {
            case exports.CSS_INSERT_RULE:
            case exports.INSERT_CHILD_NODE: {
                var _a = diff, type = _a.type, target = _a.target, index = _a.index, child = _a.child;
                var unzippedChild = compression_1.uncompressRootNode(child);
                if (idSeed) {
                    unzippedChild = utils_1.setVMObjectIds(unzippedChild, idSeed, refCount);
                    refCount = utils_1.getRefCount(unzippedChild, idSeed);
                }
                return source_mutation_1.createInsertChildMutation(type, target, unzippedChild, index);
            }
            case exports.ATTACH_SHADOW: {
                var _b = diff, type = _b.type, target = _b.target, newValue = _b.newValue;
                var unzippedChild = compression_1.uncompressRootNode(newValue);
                if (idSeed) {
                    unzippedChild = utils_1.setVMObjectIds(unzippedChild, idSeed, refCount);
                    refCount = utils_1.getRefCount(unzippedChild, idSeed);
                }
                return source_mutation_1.createSetValueMutation(type, target, unzippedChild);
            }
            default: {
                return diff;
            }
        }
    });
};
exports.patchNode2 = function (mutation, root) {
    var target = utils_1.getVMObjectFromPath(mutation.target, root);
    if (!target) {
        throw new Error("mutation " + JSON.stringify(mutation) + " doesn't have a matching node.");
    }
    var newTarget = target;
    switch (mutation.type) {
        case exports.SET_TEXT_NODE_VALUE: {
            var newValue = mutation.newValue;
            newTarget = utils_1.setTextNodeValue(target, newValue);
            break;
        }
        case exports.INSERT_ATTRIBUTE: {
            var _a = mutation, name_1 = _a.name, newValue = _a.newValue, index = _a.index;
            newTarget = utils_1.insertElementAttributeAt(target, index, name_1, newValue);
            break;
        }
        case exports.MOVE_ATTRIBUTE: {
            var _b = mutation, index = _b.index, oldIndex = _b.oldIndex;
            newTarget = utils_1.moveElementAttribute(newTarget, oldIndex, index);
            break;
        }
        case exports.REMOVE_ATTRIBUTE: {
            var _c = mutation, name_2 = _c.name, newValue = _c.newValue, index = _c.index;
            newTarget = utils_1.removeElementAttributeAt(target, index);
            break;
        }
        case exports.SET_ATTRIBUTE: {
            var _d = mutation, name_3 = _d.name, newValue = _d.newValue, index = _d.index;
            newTarget = utils_1.setElementAttributeAt(target, index, name_3, newValue);
            break;
        }
        case exports.REMOVE_SHADOW: {
            newTarget = __assign({}, newTarget, { shadow: undefined });
            break;
        }
        case exports.ATTACH_SHADOW: {
            var newValue = mutation.newValue;
            newTarget = __assign({}, newTarget, { shadow: newValue });
            break;
        }
        case exports.REMOVE_CHILD_NODE: {
            var index = mutation.index;
            newTarget = utils_1.removeChildNodeAt(newTarget, index);
            break;
        }
        case exports.INSERT_CHILD_NODE: {
            var _e = mutation, index = _e.index, child = _e.child;
            newTarget = utils_1.insertChildNode(newTarget, child, index);
            break;
        }
        case exports.MOVE_CHILD_NODE: {
            var _f = mutation, index = _f.index, oldIndex = _f.oldIndex;
            newTarget = utils_1.moveChildNode(newTarget, oldIndex, index);
            break;
        }
        case exports.CSS_SET_SELECTOR_TEXT: {
            var newValue = mutation.newValue;
            newTarget = utils_1.setCSSSelectorText(newTarget, newValue);
            break;
        }
        case exports.CSS_DELETE_STYLE_PROPERTY: {
            var index = mutation.index;
            newTarget = utils_1.removeCSSStyleProperty(newTarget, index);
            break;
        }
        case exports.CSS_MOVE_STYLE_PROPERTY: {
            var _g = mutation, index = _g.index, oldIndex = _g.oldIndex;
            newTarget = utils_1.moveCSSStyleProperty(newTarget, oldIndex, index);
            break;
        }
        case exports.CSS_INSERT_STYLE_PROPERTY: {
            var _h = mutation, name_4 = _h.name, newValue = _h.newValue, index = _h.index;
            newTarget = utils_1.insertCSSStyleProperty(newTarget, index, name_4, newValue);
            break;
        }
        case exports.CSS_SET_STYLE_PROPERTY: {
            var _j = mutation, name_5 = _j.name, newValue = _j.newValue, index = _j.index;
            newTarget = utils_1.setCSSStyleProperty(newTarget, index, name_5, newValue);
            break;
        }
        case exports.CSS_INSERT_RULE: {
            var _k = mutation, child = _k.child, index = _k.index;
            newTarget = utils_1.insertCSSRule(newTarget, child, index);
            break;
        }
        case exports.CSS_DELETE_RULE: {
            var index = mutation.index;
            newTarget = utils_1.removeCSSRuleAt(newTarget, index);
            break;
        }
        case exports.CSS_MOVE_RULE: {
            var _l = mutation, index = _l.index, oldIndex = _l.oldIndex;
            newTarget = utils_1.moveCSSRule(newTarget, oldIndex, index);
            break;
        }
        case exports.CSS_AT_RULE_SET_PARAMS: {
            var newValue = mutation.newValue;
            newTarget = utils_1.setCSSAtRuleSetParams(newTarget, newValue);
            break;
        }
    }
    if (newTarget !== target) {
        root = utils_1.replaceNestedChild(root, mutation.target, newTarget);
    }
    return root;
};
//# sourceMappingURL=diff-patch.js.map