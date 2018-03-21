"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var lodash_1 = require("lodash");
var source_mutation_1 = require("source-mutation");
module.exports = function (content, mutation, filePath) {
    var source = mutation.target.source;
    var ast = ts.createSourceFile(filePath, content, ts.ScriptTarget.ES2016, true);
    var targetNode = findTargetASTNode(ast, mutation);
    switch (mutation.type) {
    }
    // nothing
    return source_mutation_1.createStringMutation(0, 0, "");
};
var alternativeAttrName = function (name) {
    return {
        class: "className"
    }[name] || name;
};
var transformAttrValue = function (name, value) {
    if (name === "style") {
        var style_1 = {};
        value.split(";").forEach(function (property) {
            var _a = property.split(/\s*:\s*/), name = _a[0], value = _a[1];
            style_1[lodash_1.camelCase(name)] = getAttrValue(value);
        });
        return "{" + JSON.stringify(style_1) + "}";
    }
    return "\"" + value + "\"";
};
var getAttrValue = function (value) {
    if (/px$/.test(value)) {
        return Number(value.replace("px", ""));
    }
    return value;
};
var setElementTextContent = function (target, mutation) {
    if (target.kind === ts.SyntaxKind.JsxSelfClosingElement) {
        var element = target;
        // TODO
    }
    else if (target.kind === ts.SyntaxKind.JsxElement) {
        var element = target;
        return source_mutation_1.createStringMutation(element.openingElement.getEnd(), element.closingElement.getStart(), mutation.newValue);
    }
    return source_mutation_1.createStringMutation(0, 0, "");
};
var editElementAttribute = function (target, mutation) {
    var element;
    if (target.kind === ts.SyntaxKind.JsxSelfClosingElement) {
        element = target;
    }
    else if (target.kind === ts.SyntaxKind.JsxElement) {
        element = target.openingElement;
    }
    var found;
    var mutations = [];
    var mutateAttrName = alternativeAttrName(mutation.name);
    var mutateAttrValue = mutation.newValue ? transformAttrValue(mutateAttrName, mutation.newValue) : mutation.newValue;
    for (var _i = 0, _a = element.attributes.properties; _i < _a.length; _i++) {
        var attribute = _a[_i];
        // TODO - need to consider spreads
        var attr = attribute;
        if (attr.name.text === mutateAttrName) {
            found = true;
            // if the attribute value is undefined, then remove it
            if (mutateAttrValue == null) {
                return source_mutation_1.createStringMutation(attr.getStart(), attr.getEnd(), "");
            }
            else {
                return source_mutation_1.createStringMutation(attr.initializer.getStart(), attr.initializer.getEnd(), mutateAttrValue);
            }
        }
    }
    if (!found) {
        return source_mutation_1.createStringMutation(element.tagName.getEnd(), element.tagName.getEnd(), " " + mutateAttrName + "=" + mutateAttrValue);
    }
};
var isElementMutation = function (mutation) {
    // return [SET_ELEMENT_ATTRIBUTE_EDIT, SET_TEXT_CONTENT].indexOf(mutation.type) !== -1;
};
var findTargetASTNode = function (root, mutation) {
    var found;
    var content = root.getSourceFile().getText();
    var find = function (node) {
        var pos = ts.getLineAndCharacterOfPosition(root.getSourceFile(), node.getFullStart());
        var tstart = mutation.target.source.start;
        if (isElementMutation(mutation)) {
            // look for the tag name Identifier
            if (node.kind === ts.SyntaxKind.Identifier && pos.line + 1 === tstart.line && pos.character - 1 === tstart.column) {
                found = node.parent;
                if (found.kind === ts.SyntaxKind.JsxOpeningElement) {
                    found = found.parent;
                }
            }
        }
        if (!found)
            ts.forEachChild(node, find);
    };
    ts.forEachChild(root, find);
    return found;
};
//# sourceMappingURL=edit-ts-content.js.map