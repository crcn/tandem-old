"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var ast_1 = require("./ast");
var source_mutation_1 = require("source-mutation");
exports.editPaperclipSource = function (content, mutation) {
    var result = parser_1.parseModuleSource(content);
    // source is deprecated
    var targetNode = findTargetNode(result.root, mutation.target.location || mutation.target["source"]);
    if (mutation.target["source"]) {
        console.warn("Mutation target does not match expected type.");
    }
    if (!targetNode) {
        return [source_mutation_1.createStringMutation(0, 0, "")];
    }
    // switch(mutation.type) {
    //   case UPDATE_VALUE_NODE: {
    //     return editNodeValue(targetNode as PCTextNode, mutation as SetValueMutation<any>);
    //   }
    //   case SET_ELEMENT_ATTRIBUTE_EDIT: {
    //     return editElementAttribute(targetNode, mutation as SetPropertyMutation<any>);
    //   }
    //   case REMOVE_CHILD_NODE_EDIT: {
    //     return removeChildAt(targetNode as PCParent, (mutation as RemoveChildMutation<any, any>).index);
    //   }
    //   case INSERT_CHILD_NODE_EDIT: {
    //     return insertChild(targetNode as PCParent, mutation as RemoveChildMutation<any, any>, content);
    //   }
    //   case INSERT_HTML_EDIT: {
    //     return insertHTML(targetNode as PCParent, mutation as InsertHTMLMutation<any>, content);
    //   }
    //   case PC_REMOVE_CHILD_NODE: {
    //     return removeChildAt(targetNode as PCParent, (mutation as PCRemoveChildNodeMutation).index);
    //   }
    //   case PC_REMOVE_NODE: {
    //     return removeNode(targetNode);
    //   }
    //   case CSS_INSERT_CSS_RULE_TEXT: {
    //     // TODO
    //   }
    //   case CSS_PARENT_DELETE_RULE: {
    //     // TODO
    //   }
    //   case CSS_STYLE_RULE_SET_SELECTOR_TEXT: {
    //     // TODO
    //   }
    //   case CSS_STYLE_RULE_SET_STYLE_PROPERTY: {
    //     // TODO
    //   }
    // }
    return [source_mutation_1.createStringMutation(0, 0, "")];
};
var astLocationEquals = function (ast, location) { return ast.location.start.line === location.start.line && ast.location.start.column === location.start.column && ast.location.end.line === location.end.line && ast.location.end.column === location.end.column; };
var findTargetNode = function (ast, location) {
    if (astLocationEquals(ast, location)) {
        return ast;
    }
    if (ast.type === ast_1.PCExpressionType.FRAGMENT || ast.type === ast_1.PCExpressionType.ELEMENT) {
        for (var _i = 0, _a = ast.childNodes; _i < _a.length; _i++) {
            var child = _a[_i];
            var found = findTargetNode(child, location);
            if (found)
                return found;
        }
    }
};
var findTargetSheetRule = function (ast, location) {
    if (astLocationEquals(ast, location)) {
        return ast;
    }
    for (var _i = 0, _a = ast.children; _i < _a.length; _i++) {
        var child = _a[_i];
        var found = findTargetSheetRule(child, location);
        if (found)
            return found;
    }
};
var findTargetNodeFromSub = function (ast, location) {
    // TODO - need to check target kind as well
    // check if we're editing a string value (there may be a sep parser involved)
    if (ast.type === ast_1.PCExpressionType.STRING && ((ast.location.start.line === location.start.line && ast.location.start.column <= location.start.column) || ast.location.start.line < location.start.line) && ((ast.location.end.line === location.end.line && ast.location.end.column >= location.end.column) || ast.location.end.line > location.end.line)) {
        return ast;
    }
    if (ast.type === ast_1.PCExpressionType.FRAGMENT || ast.type === ast_1.PCExpressionType.ELEMENT) {
        for (var _i = 0, _a = ast.childNodes; _i < _a.length; _i++) {
            var child = _a[_i];
            var found = findTargetNodeFromSub(child, location);
            if (found)
                return found;
        }
    }
};
var removeChildAt = function (parent, index) {
    var child = parent.childNodes[index];
    return removeNode(child);
};
var removeNode = function (target) {
    return [source_mutation_1.createStringMutation(target.location.start.pos, target.location.end.pos, "")];
};
// const insertChild = (parent: PCFragment, { target, index, child }: InsertChildMutation<any, any>, source: string) => {
//   return insertHTML(parent, createInsertHTMLMutation(target, index, child.nodeValue || child.outerHTML), source);
// };
var insertHTML = function (parent, _a, source) {
    var childIndex = _a.childIndex, html = _a.html;
    if (parent.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT) {
        var parentElement = parent;
        return [source_mutation_1.createStringMutation(eatWhitespace(parentElement.location.end.pos - 2, source), parentElement.location.end.pos, ">" + html + ("</" + parentElement.name + ">"))];
    }
    var beforeChild = parent.childNodes[childIndex];
    if (!beforeChild) {
        var parentElement = parent;
        return [source_mutation_1.createStringMutation(parentElement.startTag.location.end.pos, parentElement.startTag.location.end.pos, html)];
    }
    return [source_mutation_1.createStringMutation(beforeChild.location.start.pos, beforeChild.location.start.pos, html)];
};
var eatWhitespace = function (pos, content) {
    var reverse = content.substr(0, pos).split("").reverse().join("");
    var _a = reverse.match(/^([\s\r\n\t]+)/) || ["", ""], match = _a[0], ws = _a[1];
    return pos - ws.length;
};
var editNodeValue = function (target, _a) {
    var newValue = _a.newValue;
    return [source_mutation_1.createStringMutation(target.location.start.pos, target.location.end.pos, newValue)];
};
var editElementAttribute = function (target, mutation) {
    var startTag;
    if (target.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT) {
        startTag = target;
    }
    else if (target.type === ast_1.PCExpressionType.ELEMENT) {
        startTag = target.startTag;
    }
    var found;
    var mutations = [];
    var mutateAttrName = mutation.name;
    var mutateAttrValue = mutation.newValue && "\"" + mutation.newValue + "\"";
    for (var _i = 0, _a = startTag.attributes; _i < _a.length; _i++) {
        var attribute = _a[_i];
        // TODO - need to consider spreads
        var attr = attribute;
        if (attr.name === mutateAttrName) {
            found = true;
            // if the attribute value is undefined, then remove it
            if (!mutateAttrValue) {
                // remove the whitespace before attribute
                return [source_mutation_1.createStringMutation(attr.location.start.pos - 1, attr.location.end.pos, "")];
            }
            else {
                return [source_mutation_1.createStringMutation(attr.value.location.start.pos, attr.value.location.end.pos, mutateAttrValue)];
            }
        }
    }
    if (!found) {
        var insertIndex = startTag.location.start.pos + startTag.name.length + 1;
        return [source_mutation_1.createStringMutation(insertIndex, insertIndex, mutation.newValue === true ? mutateAttrName : " " + mutateAttrName + "=" + mutateAttrValue)];
    }
};
var editStyleRuleDeclaration = function (target, _a) {
    var newValue = _a.newValue;
    var prettyStyleText = newValue.split(/\s*;\s*/g).join(";\n");
    // not tested
    return source_mutation_1.createStringMutation(target.location.start.pos, target.location.end.pos + 1, target.selectorText.trim() + " {\n      " + prettyStyleText + "\n    }");
};
//# sourceMappingURL=edit.js.map