webpackHotUpdate(0,{

/***/ "../paperclip/lib/vm.js":
/***/ (function(module, exports, __webpack_require__) {

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
var ast_1 = __webpack_require__("../paperclip/lib/ast.js");
var parser_utils_1 = __webpack_require__("../paperclip/lib/parser-utils.js");
var inferencing_1 = __webpack_require__("../paperclip/lib/inferencing.js");
var loader_1 = __webpack_require__("../paperclip/lib/loader.js");
var utils_1 = __webpack_require__("../paperclip/lib/utils.js");
var slim_dom_1 = __webpack_require__("../slim-dom/index.js");
// TODO - may eventually want to have a compilation step for this
exports.runPCFile = function (_a) {
    var _b = _a.entry, filePath = _b.filePath, componentId = _b.componentId, previewName = _b.previewName, graph = _a.graph, idSeed = _a.idSeed;
    var memoKey = "__memo$$" + filePath + componentId + previewName;
    if (graph[memoKey]) {
        return graph[memoKey];
    }
    var context = {
        idSeed: String(idSeed || Math.floor(1000 + Math.random() * 8999)),
        refCount: 0,
        currentProps: {},
        globalStyles: loader_1.getAllGlobalStyles(graph),
        currentURI: loader_1.getComponentSourceUris(graph)[componentId],
        graph: graph,
        components: loader_1.getAllComponents(graph),
        diagnostics: []
    };
    var component = context.components[componentId];
    if (!component) {
        return {
            document: null,
            diagnostics: [{ type: parser_utils_1.DiagnosticType.ERROR, message: "Component \"" + componentId + "\" does not exist", filePath: null, location: null }]
        };
    }
    var preview = previewName ? loader_1.getComponentPreview(previewName, component) : component.previews[0];
    if (!preview) {
        return {
            document: null,
            diagnostics: [{ type: parser_utils_1.DiagnosticType.ERROR, message: "Preview \"" + previewName + "\" does not exist for component \"" + componentId + "\"", filePath: null, location: null }]
        };
    }
    return graph[memoKey] = {
        document: runPreview(preview.source, context),
        diagnostics: []
    };
};
var createId = function (context) {
    return context.idSeed + (++context.refCount);
};
var runPreview = function (preview, context) {
    var root = {
        id: createId(context),
        type: slim_dom_1.SlimVMObjectType.DOCUMENT_FRAGMENT,
        childNodes: [],
        source: createVMSource(preview, context)
    };
    for (var i = 0, length_1 = context.globalStyles.length; i < length_1; i++) {
        root = appendChildNode(root, context.globalStyles[i], context);
    }
    root = appendChildNodes(root, preview.childNodes, context);
    return root;
};
var appendElement = function (parent, child, context) {
    var _repeat;
    var startTag = child.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT ? child : child.startTag;
    for (var i = 0, length_2 = startTag.modifiers.length; i < length_2; i++) {
        var modifier = startTag.modifiers[i].value;
        if (modifier.type === ast_1.BKExpressionType.REPEAT) {
            _repeat = modifier;
            break;
        }
    }
    if (_repeat) {
        utils_1.eachValue(evalExpr(_repeat.each, context), function (item, i) {
            var oldProps = context.currentProps;
            context.currentProps = __assign({}, context.currentProps, (_a = {}, _a[_repeat.asValue.name] = item, _a[_repeat.asKey ? _repeat.asKey.name : "__i"] = i, _a));
            parent = appendRawElement(parent, child, context);
            context.currentProps = oldProps;
            var _a;
        });
    }
    else {
        parent = appendRawElement(parent, child, context);
    }
    return parent;
};
var appendRawElement = function (parent, child, context) {
    var startTag;
    var childNodes;
    if (child.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT) {
        childNodes = [];
        startTag = child;
    }
    else {
        var el = child;
        childNodes = el.childNodes;
        startTag = el.startTag;
    }
    var name = startTag.name;
    if (name === "link") {
        return parent;
    }
    var attributes = [];
    var props = {};
    for (var i = 0, length_3 = startTag.attributes.length; i < length_3; i++) {
        var attribute = startTag.attributes[i];
        var value = normalizeAttributeValue(attribute.name, evalAttributeValue(attribute.value, context));
        props[attribute.name] = value;
        attributes.push({
            name: attribute.name,
            value: value,
        });
    }
    for (var i = 0, length_4 = startTag.modifiers.length; i < length_4; i++) {
        var modifier = startTag.modifiers[i].value;
        if (modifier.type === ast_1.BKExpressionType.BIND) {
            Object.assign(props, evalExpr(modifier, context) || {});
        }
    }
    if (name === "style") {
        var style = {
            id: createId(context),
            type: slim_dom_1.SlimVMObjectType.ELEMENT,
            tagName: name,
            attributes: attributes,
            childNodes: [],
            source: createVMSource(child, context),
            sheet: createStyleSheet(childNodes[0], context)
        };
        return slim_dom_1.pushChildNode(parent, style);
    }
    var shadow;
    var component = context.components[name];
    if (component) {
        shadow = {
            id: createId(context),
            type: slim_dom_1.SlimVMObjectType.DOCUMENT_FRAGMENT,
            childNodes: [],
            source: createVMSource(component.source, context)
        };
        if (component.style) {
            shadow = appendChildNode(shadow, component.style, context);
        }
        var oldURI = context.currentURI;
        var oldProps = context.currentProps;
        context.currentURI = loader_1.getComponentSourceUris(context.graph)[component.id];
        context.currentProps = props;
        shadow = appendChildNodes(shadow, component.template.childNodes, context);
        context.currentURI = oldURI;
        context.currentProps = oldProps;
    }
    var element = {
        id: createId(context),
        type: slim_dom_1.SlimVMObjectType.ELEMENT,
        tagName: name,
        attributes: attributes,
        childNodes: [],
        source: createVMSource(child, context),
        shadow: shadow
    };
    element = appendChildNodes(element, childNodes, context);
    parent = slim_dom_1.pushChildNode(parent, element);
    return parent;
};
var normalizeAttributeValue = function (name, value) {
    // TODO - check if this is STRING instead
    if (name === "style") {
        // return stringifyStyleAttributeValue(value);
    }
    return value;
};
var evalAttributeValue = function (value, context) {
    if (!value) {
        return true;
    }
    else if (value.type === ast_1.PCExpressionType.STRING_BLOCK) {
        return value.values.map(function (expr) { return evalAttributeValue(expr, context); }).join("");
    }
    else if (value.type === ast_1.PCExpressionType.STRING) {
        return value.value;
    }
    else {
        return evalExpr(value.value, context);
    }
};
var appendChildNode = function (parent, child, context) {
    switch (child.type) {
        case ast_1.PCExpressionType.TEXT_NODE: return appendTextNode(parent, child, context);
        case ast_1.PCExpressionType.BLOCK: return appendTextBlock(parent, child, context);
        case ast_1.PCExpressionType.ELEMENT:
        case ast_1.PCExpressionType.SELF_CLOSING_ELEMENT: return appendElement(parent, child, context);
        default: return parent;
    }
};
var appendChildNodes = function (parent, childNodes, context) {
    // TODO - check for conditional stuff here
    var _passedCondition;
    for (var i = 0, length_5 = childNodes.length; i < length_5; i++) {
        var startTag = void 0;
        var childNode = childNodes[i];
        startTag = childNode.type === ast_1.PCExpressionType.ELEMENT ? childNode.startTag : childNode.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT ? childNode : null;
        if (startTag) {
            var _if = void 0;
            var _isCondition = void 0;
            for (var i_1 = 0, length_6 = startTag.modifiers.length; i_1 < length_6; i_1++) {
                var modifier = startTag.modifiers[i_1].value;
                if (modifier.type === ast_1.BKExpressionType.IF || modifier.type === ast_1.BKExpressionType.ELSEIF) {
                    _if = modifier;
                    _isCondition = true;
                }
                else if (modifier.type === ast_1.BKExpressionType.ELSE) {
                    _isCondition = true;
                }
            }
            if (_isCondition) {
                if (_if ? evalExpr(_if.condition, context) : !_passedCondition) {
                    _passedCondition = true;
                }
                else {
                    continue;
                }
            }
        }
        parent = appendChildNode(parent, childNodes[i], context);
    }
    return parent;
};
var appendTextNode = function (parent, child, context) {
    return slim_dom_1.pushChildNode(parent, {
        id: createId(context),
        type: slim_dom_1.SlimVMObjectType.TEXT,
        value: String(child.value || "").trim() || " ",
        source: createVMSource(child, context)
    });
};
var appendTextBlock = function (parent, child, context) { return slim_dom_1.pushChildNode(parent, {
    id: createId(context),
    type: slim_dom_1.SlimVMObjectType.TEXT,
    value: evalExpr(child.value, context),
    source: createVMSource(child, context)
}); };
var createStyleSheet = function (expr, context) {
    var rules = new Array(expr.children.length);
    for (var i = 0, length_7 = expr.children.length; i < length_7; i++) {
        var child = expr.children[i];
        rules[i] = createCSSRule(child, context);
    }
    return {
        rules: rules,
        id: createId(context),
        type: slim_dom_1.SlimVMObjectType.STYLE_SHEET,
        source: createVMSource(expr, context)
    };
};
var createCSSRule = function (rule, context) {
    var source = createVMSource(rule, context);
    switch (rule.type) {
        case ast_1.CSSExpressionType.STYLE_RULE: {
            var _a = rule, selectorText = _a.selectorText, children = _a.children;
            var style = {
                id: createId(context),
            };
            for (var i = 0, length_8 = children.length; i < length_8; i++) {
                var child = children[i];
                if (child.type === ast_1.CSSExpressionType.DECLARATION_PROPERTY) {
                    var decl = child;
                    style[decl.name] = decl.value;
                }
            }
            ;
            return {
                id: createId(context),
                type: slim_dom_1.SlimVMObjectType.STYLE_RULE,
                selectorText: selectorText,
                style: style,
                source: source
            };
        }
        case ast_1.CSSExpressionType.AT_RULE: {
            var _b = rule, name_1 = _b.name, params = _b.params, children = _b.children;
            var rules = new Array(children.length);
            for (var i = 0, length_9 = children.length; i < length_9; i++) {
                var child = children[i];
                rules[i] = createCSSRule(child, context);
            }
            if (name_1 === "media") {
                return {
                    id: createId(context),
                    type: slim_dom_1.SlimVMObjectType.MEDIA_RULE,
                    conditionText: params.join(" "),
                    rules: rules,
                    source: source,
                };
            }
        }
    }
};
var evalExpr = function (expr, context) {
    switch (expr.type) {
        case ast_1.BKExpressionType.OPERATION: {
            var _a = expr, left = _a.left, operator = _a.operator, right = _a.right;
            var lv = evalExpr(left, context);
            var rv = evalExpr(right, context);
            switch (operator) {
                case "+": return lv + rv;
                case "-": return lv - rv;
                case "*": return lv * rv;
                case "/": return lv / rv;
                case "%": return lv % rv;
                case "&&": return lv && rv;
                case "||": return lv || rv;
                case "==": return lv == rv;
                case "===": return lv === rv;
                case "!=": return lv != rv;
                case "!==": return lv !== rv;
                case ">": return lv > rv;
                case ">=": return lv >= rv;
                case "<": return lv < rv;
                case "<=": return lv <= rv;
            }
        }
        case ast_1.BKExpressionType.NUMBER: {
            return Number(expr.value);
        }
        case ast_1.BKExpressionType.STRING: {
            return String(expr.value);
        }
        case ast_1.BKExpressionType.OBJECT: {
            var obj = expr;
            var ret = {};
            for (var _i = 0, _b = obj.properties; _i < _b.length; _i++) {
                var _c = _b[_i], key = _c.key, value = _c.value;
                ret[key] = evalExpr(value, context);
            }
            return ret;
        }
        case ast_1.BKExpressionType.ARRAY: {
            var ary = expr;
            var ret = [];
            for (var _d = 0, _e = ary.values; _d < _e.length; _d++) {
                var value = _e[_d];
                ret.push(evalExpr(value, context));
            }
            return ret;
        }
        case ast_1.BKExpressionType.NOT: {
            return !evalExpr(expr.value, context);
        }
        case ast_1.BKExpressionType.GROUP: {
            return evalExpr(expr.value, context);
        }
        case ast_1.BKExpressionType.BIND: {
            return evalExpr(expr.value, context);
        }
        case ast_1.BKExpressionType.IF:
        case ast_1.BKExpressionType.ELSEIF: {
            return evalExpr(expr.condition, context);
        }
        case ast_1.BKExpressionType.PROP_REFERENCE:
        case ast_1.BKExpressionType.VAR_REFERENCE: {
            var keypath = inferencing_1.getReferenceKeyPath(expr);
            var current = context.currentProps;
            for (var i = 0, length_10 = keypath.length; i < length_10; i++) {
                current = current[keypath[i]];
                if (!current)
                    break;
            }
            return current;
        }
        default: return null;
    }
};
var createVMSource = function (expr, context) { return ({
    type: expr.type,
    uri: context.currentURI,
    range: {
        start: expr.location.start,
        end: expr.location.end
    }
}); };
//# sourceMappingURL=vm.js.map

/***/ })

})