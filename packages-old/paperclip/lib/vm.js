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
var ast_1 = require("./ast");
var parser_utils_1 = require("./parser-utils");
var path = require("path");
var inferencing_1 = require("./inferencing");
var loader_1 = require("./loader");
var utils_1 = require("./utils");
var slim_dom_1 = require("slim-dom");
// TODO - may eventually want to have a compilation step for this
exports.runPCFile = function (_a) {
    var _b = _a.entry, filePath = _b.filePath, componentId = _b.componentId, previewName = _b.previewName, graph = _a.graph, _c = _a.directoryAliases, directoryAliases = _c === void 0 ? {} : _c;
    var memoKey = "__memo$$" + filePath + componentId + previewName;
    if (graph[memoKey]) {
        return graph[memoKey];
    }
    var context = {
        refCount: 0,
        currentProps: {},
        currentURI: loader_1.getComponentSourceUris(graph)[componentId],
        graph: graph,
        directoryAliases: directoryAliases,
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
var runPreview = function (preview, context) {
    var root = {
        type: slim_dom_1.SlimVMObjectType.DOCUMENT_FRAGMENT,
        childNodes: [],
        source: createVMSource(preview, context)
    };
    var scannedDeps = {};
    var entry = context.currentURI;
    root = addGlobalStyles(root, context, {});
    root = appendChildNodes(root, preview.childNodes, context);
    return root;
};
var addGlobalStyles = function (root, context, scanned) {
    var currentURI = context.currentURI, graph = context.graph;
    var _a = graph[currentURI], module = _a.module, resolvedImportUris = _a.resolvedImportUris;
    var scopedSheets = getScopedStyleSheets(context);
    for (var componentId in scopedSheets) {
        var sheet = scopedSheets[componentId];
        root = slim_dom_1.pushChildNode(root, createStyleElementFromSheet(sheet, context, componentId));
    }
    if (module.type === loader_1.PCModuleType.COMPONENT) {
        var globalStyles = module.globalStyles;
        for (var i = 0, length_1 = globalStyles.length; i < length_1; i++) {
            var style = globalStyles[i];
            root = slim_dom_1.pushChildNode(root, createStyleElementFromSheet(style.childNodes[0], context));
        }
    }
    else if (module.type === loader_1.PCModuleType.CSS) {
        var source = module.source;
        root = slim_dom_1.pushChildNode(root, createStyleElementFromSheet(source, context));
    }
    for (var relPath in resolvedImportUris) {
        var resolvedUri = resolvedImportUris[relPath];
        if (scanned[resolvedUri]) {
            continue;
        }
        scanned[resolvedUri] = true;
        context.currentURI = resolvedUri;
        // dep may not be loaded if there's an error
        if (context.graph[context.currentURI]) {
            root = addGlobalStyles(root, context, scanned);
        }
        context.currentURI = currentURI;
    }
    return root;
};
var createStyleElementFromSheet = function (sheet, context, scopedTagName) {
    var attributes = [];
    if (scopedTagName) {
        attributes.push({ name: "scope", value: scopedTagName });
    }
    return {
        type: slim_dom_1.SlimVMObjectType.ELEMENT,
        tagName: "style",
        attributes: attributes,
        childNodes: [],
        source: null,
        sheet: createStyleSheet(sheet, context)
    };
};
var getScopedStyleSheets = function (context) {
    var scopedSheets = {};
    var module = context.graph[context.currentURI].module;
    if (module.type === loader_1.PCModuleType.COMPONENT) {
        var componentModule = module;
        for (var i = 0, length_2 = componentModule.components.length; i < length_2; i++) {
            var component = componentModule.components[i];
            if (component.style) {
                scopedSheets[component.id] = component.style.childNodes[0];
            }
        }
    }
    return scopedSheets;
};
var appendElement = function (parent, child, context) {
    var _repeat;
    var startTag = child.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT ? child : child.startTag;
    for (var i = 0, length_3 = startTag.modifiers.length; i < length_3; i++) {
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
    // style elements are added at the top
    if (name === "link" || name === "style") {
        return parent;
    }
    var attributes = [];
    var props = {};
    for (var i = 0, length_4 = startTag.attributes.length; i < length_4; i++) {
        var attribute = startTag.attributes[i];
        var value = normalizeAttributeValue(attribute.name, evalAttributeValue(attribute.value, context));
        props[attribute.name] = value;
        attributes.push({
            name: attribute.name,
            value: value,
        });
    }
    for (var i = 0, length_5 = startTag.modifiers.length; i < length_5; i++) {
        var modifier = startTag.modifiers[i].value;
        if (modifier.type === ast_1.BKExpressionType.BIND) {
            var bindProps = evalExpr(modifier, context) || {};
            for (var name_1 in bindProps) {
                var value = bindProps[name_1];
                if (value !== false && value != null) {
                    attributes.push({ name: name_1, value: value });
                }
            }
            Object.assign(props, bindProps);
        }
    }
    var shadow;
    var component = context.components[name];
    if (component) {
        shadow = {
            type: slim_dom_1.SlimVMObjectType.DOCUMENT_FRAGMENT,
            childNodes: [],
            source: createVMSource(component.source, context)
        };
        var oldURI = context.currentURI;
        var oldProps = context.currentProps;
        context.currentURI = loader_1.getComponentSourceUris(context.graph)[component.id];
        context.currentProps = props;
        if (component.style) {
            shadow = appendChildNode(shadow, component.style, context);
        }
        shadow = appendChildNodes(shadow, component.template.childNodes, context);
        context.currentURI = oldURI;
        context.currentProps = oldProps;
    }
    var element = {
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
    for (var i = 0, length_6 = childNodes.length; i < length_6; i++) {
        var startTag = void 0;
        var childNode = childNodes[i];
        startTag = childNode.type === ast_1.PCExpressionType.ELEMENT ? childNode.startTag : childNode.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT ? childNode : null;
        if (startTag) {
            var _if = void 0;
            var _isCondition = void 0;
            for (var i_1 = 0, length_7 = startTag.modifiers.length; i_1 < length_7; i_1++) {
                var modifier = startTag.modifiers[i_1].value;
                if (modifier.type === ast_1.BKExpressionType.IF || modifier.type === ast_1.BKExpressionType.ELSEIF) {
                    _if = modifier;
                    _isCondition = true;
                    // reset
                    _passedCondition = modifier.type === ast_1.BKExpressionType.IF ? false : _passedCondition;
                }
                else if (modifier.type === ast_1.BKExpressionType.ELSE) {
                    _isCondition = true;
                }
            }
            if (_isCondition) {
                if (!_passedCondition && (!_if || evalExpr(_if.condition, context))) {
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
        type: slim_dom_1.SlimVMObjectType.TEXT,
        value: String(child.value || "") || " ",
        source: createVMSource(child, context)
    });
};
var appendTextBlock = function (parent, child, context) { return slim_dom_1.pushChildNode(parent, {
    type: slim_dom_1.SlimVMObjectType.TEXT,
    value: evalExpr(child.value, context),
    source: createVMSource(child, context)
}); };
var createStyleSheet = function (expr, context) {
    var rules = new Array(expr.children.length);
    for (var i = 0, length_8 = expr.children.length; i < length_8; i++) {
        var child = expr.children[i];
        rules[i] = createCSSRule(child, context);
    }
    return {
        rules: rules,
        type: slim_dom_1.SlimVMObjectType.STYLE_SHEET,
        source: createVMSource(expr, context)
    };
};
var createCSSRule = function (rule, context) {
    var source = createVMSource(rule, context);
    if (rule.type === ast_1.CSSExpressionType.STYLE_RULE || (rule.type === ast_1.CSSExpressionType.AT_RULE && rule.name === "font-face")) {
        var _a = rule, selectorText = _a.selectorText, children = _a.children;
        var style = [];
        for (var i = 0, length_9 = children.length; i < length_9; i++) {
            var child = children[i];
            if (child.type === ast_1.CSSExpressionType.DECLARATION_PROPERTY) {
                var decl = child;
                var value = decl.value;
                if (/url\(/.test(value)) {
                    value = value.replace(/url\(["'](.*?)["']\)/g, function (match, url) {
                        if (url.charAt(0) === "." || url.charAt(0) === "/") {
                            return "url(\"" + resolveFile(path.resolve(path.dirname(context.currentURI), url), context) + "\")";
                        }
                        return match;
                    });
                }
                style.push({
                    name: decl.name,
                    value: value,
                });
            }
        }
        ;
        if (rule.type === ast_1.CSSExpressionType.AT_RULE) {
            return {
                type: slim_dom_1.SlimVMObjectType.FONT_FACE_RULE,
                style: style,
                source: source
            };
        }
        return {
            // TODO - need to check for font face
            type: slim_dom_1.SlimVMObjectType.STYLE_RULE,
            selectorText: selectorText,
            style: style,
            source: source
        };
    }
    else if (rule.type === ast_1.CSSExpressionType.AT_RULE) {
        var _b = rule, name_2 = _b.name, params = _b.params, children = _b.children;
        var rules = new Array(children.length);
        for (var i = 0, length_10 = children.length; i < length_10; i++) {
            var child = children[i];
            rules[i] = createCSSRule(child, context);
        }
        if (name_2 === "import") {
            var module = context.graph[context.currentURI];
            var resolvedImportUri = module.resolvedImportUris[params[0]];
            if (resolvedImportUri) {
                params = [resolveFile(resolvedImportUri, context)];
            }
            else {
                // this shouldn't happen
                console.error("Unresolved CSS import: " + params[0]);
            }
        }
        return {
            name: name_2,
            type: slim_dom_1.SlimVMObjectType.AT_RULE,
            params: params.join("").trim(),
            rules: rules,
            source: source,
        };
    }
};
var resolveFile = function (filePath, context) {
    for (var dir in context.directoryAliases) {
        if (filePath.indexOf(dir) === 0) {
            return filePath.replace(dir, context.directoryAliases[dir]);
        }
    }
    return filePath;
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
        case ast_1.BKExpressionType.RESERVED_KEYWORD: {
            var value = expr.value;
            if (value === "null")
                return null;
            if (value === "undefined")
                return undefined;
            if (value === "false" || value === "true")
                return value === "true";
            return undefined;
        }
        case ast_1.BKExpressionType.IF:
        case ast_1.BKExpressionType.ELSEIF: {
            return evalExpr(expr.condition, context);
        }
        case ast_1.BKExpressionType.PROP_REFERENCE:
        case ast_1.BKExpressionType.VAR_REFERENCE: {
            var keypath = inferencing_1.getReferenceKeyPath(expr);
            var current = context.currentProps;
            for (var i = 0, length_11 = keypath.length; i < length_11; i++) {
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