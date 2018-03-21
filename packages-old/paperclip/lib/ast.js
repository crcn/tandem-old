"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PCExpressionType;
(function (PCExpressionType) {
    PCExpressionType[PCExpressionType["STRING"] = 0] = "STRING";
    PCExpressionType[PCExpressionType["BLOCK"] = 1] = "BLOCK";
    PCExpressionType[PCExpressionType["STRING_BLOCK"] = 2] = "STRING_BLOCK";
    PCExpressionType[PCExpressionType["ELEMENT"] = 3] = "ELEMENT";
    PCExpressionType[PCExpressionType["SELF_CLOSING_ELEMENT"] = 4] = "SELF_CLOSING_ELEMENT";
    PCExpressionType[PCExpressionType["TEXT_NODE"] = 5] = "TEXT_NODE";
    PCExpressionType[PCExpressionType["COMMENT"] = 6] = "COMMENT";
    PCExpressionType[PCExpressionType["ATTRIBUTE"] = 7] = "ATTRIBUTE";
    PCExpressionType[PCExpressionType["START_TAG"] = 8] = "START_TAG";
    PCExpressionType[PCExpressionType["BLOCK_STRING"] = 9] = "BLOCK_STRING";
    PCExpressionType[PCExpressionType["FRAGMENT"] = 10] = "FRAGMENT";
    PCExpressionType[PCExpressionType["END_TAG"] = 11] = "END_TAG";
})(PCExpressionType = exports.PCExpressionType || (exports.PCExpressionType = {}));
;
var BKExpressionType;
(function (BKExpressionType) {
    BKExpressionType["TYPE"] = "TYPE";
    BKExpressionType["BIND"] = "BIND";
    BKExpressionType["IF"] = "IF";
    BKExpressionType["STRING"] = "STRING";
    BKExpressionType["OBJECT"] = "OBJECT";
    BKExpressionType["ARRAY"] = "ARRAY";
    BKExpressionType["KEY_VALUE_PAIR"] = "KEY_VALUE_PAIR";
    BKExpressionType["NUMBER"] = "NUMBER";
    BKExpressionType["PROPERTY"] = "PROPERTY";
    BKExpressionType["RESERVED_KEYWORD"] = "RESERVED_KEYWORD";
    BKExpressionType["ELSEIF"] = "ELSEIF";
    BKExpressionType["NOT"] = "NOT";
    BKExpressionType["OPERATION"] = "OPERATION";
    BKExpressionType["GROUP"] = "GROUP";
    BKExpressionType["VAR_REFERENCE"] = "VAR_REFERENCE";
    BKExpressionType["PROP_REFERENCE"] = "PROP_REFERENCE";
    BKExpressionType["ELSE"] = "ELSE";
    BKExpressionType["REPEAT"] = "REPEAT";
})(BKExpressionType = exports.BKExpressionType || (exports.BKExpressionType = {}));
;
var CSSExpressionType;
(function (CSSExpressionType) {
    CSSExpressionType[CSSExpressionType["SHEET"] = 0] = "SHEET";
    CSSExpressionType[CSSExpressionType["DECLARATION_PROPERTY"] = 1] = "DECLARATION_PROPERTY";
    CSSExpressionType[CSSExpressionType["STYLE_RULE"] = 2] = "STYLE_RULE";
    CSSExpressionType[CSSExpressionType["AT_RULE"] = 3] = "AT_RULE";
    CSSExpressionType[CSSExpressionType["IMPORT"] = 4] = "IMPORT";
    CSSExpressionType[CSSExpressionType["CHARSET"] = 5] = "CHARSET";
})(CSSExpressionType = exports.CSSExpressionType || (exports.CSSExpressionType = {}));
;
var DcExpressionType;
(function (DcExpressionType) {
    DcExpressionType["COLOR"] = "COLOR";
    DcExpressionType["CALL"] = "CALL";
    DcExpressionType["MEASUREMENT"] = "MEASUREMENT";
    DcExpressionType["SPACED_LIST"] = "SPACED_LIST";
    DcExpressionType["COMMA_LIST"] = "COMMA_LIST";
    DcExpressionType["KEYWORD"] = "KEYWORD";
    DcExpressionType["LIST"] = "LIST";
})(DcExpressionType = exports.DcExpressionType || (exports.DcExpressionType = {}));
;
exports.getElementChildNodes = function (ast) { return ast.type == PCExpressionType.SELF_CLOSING_ELEMENT ? [] : ast.childNodes; };
exports.getElementTagName = function (ast) { return ast.type == PCExpressionType.SELF_CLOSING_ELEMENT ? ast.name : ast.startTag.name; };
// TODO - assert string value
exports.getAttributeStringValue = function (attr) { return attr.value.value; };
exports.getElementAttributes = function (ast) { return exports.getStartTag(ast).attributes; };
exports.getElementModifiers = function (ast) { return exports.getStartTag(ast).modifiers; };
exports.isTag = function (ast) { return ast.type === PCExpressionType.ELEMENT || ast.type === PCExpressionType.ELEMENT || ast.type === PCExpressionType.START_TAG || ast.type === PCExpressionType.END_TAG || ast.type === PCExpressionType.SELF_CLOSING_ELEMENT; };
exports.filterPCElementsByStartTag = function (ast, filter) { return exports.filterPCASTTree(ast, function (expression) { return (expression.type === PCExpressionType.SELF_CLOSING_ELEMENT ? filter(expression) : expression.type === PCExpressionType.ELEMENT ? filter(expression.startTag) : false); }); };
exports.getElementStartTag = function (element) { return element.type === PCExpressionType.SELF_CLOSING_ELEMENT || element.type == PCExpressionType.START_TAG ? element : element.startTag; };
exports.getPCStartTagAttribute = function (element, name) {
    if (!exports.hasPCStartTagAttribute(element, name))
        return;
    var attr = exports.getElementStartTag(element).attributes.find(function (attr) { return attr.name === name; });
    return attr && attr.value && attr.value.value;
};
exports.hasPCStartTagAttribute = function (element, name) {
    return (element.type === PCExpressionType.ELEMENT || element.type === PCExpressionType.SELF_CLOSING_ELEMENT || element.type === PCExpressionType.START_TAG) && Boolean(exports.getElementStartTag(element).attributes.find(function (attr) { return attr.name === name; }));
};
exports.getPCStyleElements = function (parent) { return exports.filterPCASTTree(parent, function (expression) { return expression.type === PCExpressionType.ELEMENT && expression.startTag.name === "style"; }); };
exports.getPCLinkStyleElements = function (parent) { return exports.filterPCASTTree(parent, function (expression) { return expression.type === PCExpressionType.SELF_CLOSING_ELEMENT && expression.name === "link" && exports.getPCStartTagAttribute(expression, "rel") === "stylesheet"; }); };
exports.getPCCSSElements = function (parent) { return exports.getPCStyleElements(parent).concat(exports.getPCLinkStyleElements(parent)); };
/**
 * @param ast
 */
exports.getPCMetaTags = function (ast) {
    return exports.getPCASTElementsByTagName(ast, "meta");
};
/**
 * Returns the human friendly name of the module, otherwise the file path is used
 * @param ast
 */
exports.getPCMetaName = function (ast) {
    var nameMetaTag = exports.getPCMetaTags(ast).find(function (meta) { return Boolean(exports.getPCStartTagAttribute(meta, "name")); });
    return nameMetaTag && exports.getPCStartTagAttribute(nameMetaTag, "content");
};
exports.traversePCAST = function (ast, each, path) {
    if (path === void 0) { path = []; }
    if (each(ast, path) === false) {
        return false;
    }
    if (ast.childNodes) {
        var parent_1 = ast;
        for (var i = 0, length_1 = parent_1.childNodes.length; i < length_1; i++) {
            var child = parent_1.childNodes[i];
            if (exports.traversePCAST(child, each, path.concat(["childNodes", i])) === false) {
                return false;
            }
        }
    }
};
exports.getStartTag = function (element) {
    return element.type === PCExpressionType.ELEMENT ? element.startTag : element;
};
exports.getPCElementModifier = function (element, type) {
    return exports.getStartTag(element).modifiers.find(function (modifier) { return modifier.value.type === type; });
};
exports.getExpressionPath = function (expression, root) {
    var _path;
    exports.traversePCAST(root, function (child, path) {
        if (child === expression) {
            _path = path;
            return false;
        }
    });
    return _path;
};
exports.filterPCASTTree = function (ast, filter) {
    var expressions = [];
    exports.traversePCAST(ast, function (expression) {
        if (filter(expression)) {
            expressions.push(expression);
        }
    });
    return expressions;
};
exports.getPCASTElementsByTagName = function (ast, tagName) { return exports.filterPCElementsByStartTag(ast, function (tag) { return tag.name === tagName; }); };
exports.getPCParent = function (root, tagOrChild) { return exports.filterPCASTTree(root, function (expr) { return expr["childNodes"] && expr["childNodes"].find(function (child) {
    return child === tagOrChild || (tagOrChild.type === PCExpressionType.START_TAG && child.type === PCExpressionType.ELEMENT && child.startTag === tagOrChild);
}); })[0]; };
exports.getAllChildElementNames = function (root) {
    var childElementNames = [];
    exports.traversePCAST(root, function (element) {
        if (exports.isTag(element) && childElementNames.indexOf(exports.getStartTag(element).name) === -1) {
            childElementNames.push(exports.getStartTag(element).name);
        }
    });
    return childElementNames;
};
//# sourceMappingURL=ast.js.map