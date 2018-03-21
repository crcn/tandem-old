webpackHotUpdate(0,{

/***/ "../paperclip/lib/linting.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
TODOS:

- *variant testing
- check for props that don't exist in inference
*/
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_utils_1 = __webpack_require__("../paperclip/lib/parser-utils.js");
var inferencing_1 = __webpack_require__("../paperclip/lib/inferencing.js");
var utils_1 = __webpack_require__("../paperclip/lib/utils.js");
var ast_1 = __webpack_require__("../paperclip/lib/ast.js");
var MAX_CALLSTACK_OCCURRENCE = 10;
exports.lintDependencyGraph = utils_1.weakMemo(function (graph, options) {
    if (options === void 0) { options = {}; }
    var allComponents = {};
    for (var filePath in graph) {
        var module_1 = graph[filePath].module;
        for (var _i = 0, _a = module_1.components; _i < _a.length; _i++) {
            var component = _a[_i];
            allComponents[component.id] = {
                filePath: filePath,
                component: component
            };
        }
    }
    var context = {
        graph: graph,
        currentComponentId: null,
        options: options,
        currentFilePath: null,
        ignoreTagNames: {},
        callstack: [],
        components: allComponents,
        diagnostics: []
    };
    for (var componentId in allComponents) {
        var _b = allComponents[componentId], filePath = _b.filePath, component = _b.component;
        context = lintComponent(component, __assign({}, context, { currentComponentId: componentId, currentFilePath: filePath }));
    }
    return {
        diagnostics: dedupeDiagnostics(context.diagnostics)
    };
});
var dedupeDiagnostics = function (diagnostics) {
    var stringified = diagnostics.map(function (diag) { return JSON.stringify(diag); });
    var used = {};
    var deduped = [];
    for (var i = 0, length_1 = stringified.length; i < length_1; i++) {
        var str = stringified[i];
        if (used[str]) {
            continue;
        }
        used[str] = 1;
        deduped.push(diagnostics[i]);
    }
    return deduped;
};
var lintComponent = function (component, context) {
    context = lintNode(component.template, context);
    for (var i = 0, length_2 = component.previews.length; i < length_2; i++) {
        var preview = component.previews[i];
        context = lintNode(preview, context);
    }
    return context;
};
var lintNode = function (node, context) {
    switch (node.type) {
        case ast_1.PCExpressionType.FRAGMENT: return lintFragment(node, context);
        case ast_1.PCExpressionType.SELF_CLOSING_ELEMENT:
        case ast_1.PCExpressionType.ELEMENT: return lintElement(node, context);
        case ast_1.PCExpressionType.BLOCK: return lintTextBlock(node, context);
    }
    return context;
};
var lintTextBlock = function (node, context) {
    return lintExpr(node.value, context);
};
var lintNodes = function (nodes, context) {
    for (var i = 0, length_3 = nodes.length; i < length_3; i++) {
        context = lintNode(nodes[i], context);
    }
    return context;
};
var lintFragment = function (node, context) { return lintNodes(node.childNodes, context); };
var lintElement = function (element, context) {
    var childNodes;
    var startTag;
    if (element.type === ast_1.PCExpressionType.ELEMENT) {
        var el = element;
        childNodes = el.childNodes;
        startTag = el.startTag;
    }
    else {
        var el = element;
        startTag = el;
        childNodes = [];
    }
    var numLoops = context.callstack.filter(function (caller) { return caller.source === startTag; }).length;
    if (numLoops > MAX_CALLSTACK_OCCURRENCE) {
        return addDiagnosticError(element, "Maximum callstack exceeded", context);
    }
    if (context.ignoreTagNames[startTag.name.toLowerCase()]) {
        return context;
    }
    var _if;
    var _repeat;
    for (var i = 0, length_4 = startTag.modifiers.length; i < length_4; i++) {
        var modifier = startTag.modifiers[i].value;
        if (modifier.type === ast_1.BKExpressionType.IF || modifier.type === ast_1.BKExpressionType.ELSEIF) {
            _if = modifier;
        }
        else if (modifier.type === ast_1.BKExpressionType.REPEAT) {
            _repeat = modifier;
        }
    }
    if (_if) {
        context = lintExpr(_if, context);
        if (!context.currentExprEvalResult) {
            return context;
        }
        else {
        }
    }
    if (_repeat) {
        var each = _repeat.each, asValue = _repeat.asValue, asKey = _repeat.asKey;
        var asValueName_1 = asValue.name;
        context = lintExpr(each, context);
        var currentFilePath_1 = context.currentFilePath;
        eachValue(context.currentExprEvalResult.value, function (item, index) {
            context = lintStartTagAttributes(startTag, pushCaller(item.source, currentFilePath_1, (_a = {},
                _a[asValueName_1] = item,
                _a), context));
            context = lintNodes(childNodes, context);
            context = popCaller(context);
            var _a;
        });
    }
    else {
        context = lintStartTagAttributes(startTag, context);
        context = lintNodes(childNodes, context);
    }
    return context;
};
var EMPTY_OBJECT = {};
var lintStartTagAttributes = function (startTag, context) {
    var props = {};
    var prevFilePath = context.currentFilePath;
    var attributesByKey = {};
    for (var i = 0, length_5 = startTag.attributes.length; i < length_5; i++) {
        var attribute = startTag.attributes[i];
        attributesByKey[attribute.name] = attribute;
    }
    // required props
    for (var propertyName in attributesByKey) {
        var attribute = attributesByKey[propertyName];
        context = lintAttributeValue(attribute, context);
        props[propertyName] = context.currentExprEvalResult.value;
    }
    for (var i = 0, length_6 = startTag.modifiers.length; i < length_6; i++) {
        var modifier = startTag.modifiers[i].value;
        if (modifier.type === ast_1.BKExpressionType.BIND) {
            var bind = modifier;
            context = lintExpr(bind, context);
            Object.assign(props, context.currentExprEvalResult.value);
        }
    }
    var _a = context.components[startTag.name.toLowerCase()] || EMPTY_OBJECT, filePath = _a.filePath, component = _a.component;
    if (!component) {
        return context;
    }
    var currentComponentId = context.currentComponentId;
    context = lintNode(component.source, ignoreTagName("preview", pushCaller(startTag, filePath, props, setCurrentComponentId(startTag.name, context))));
    return unignoreTagName("preview", popCaller(setCurrentComponentId(currentComponentId, context)));
};
var setCurrentFilePath = function (filePath, context) { return (__assign({}, context, { currentFilePath: filePath })); };
var getInferenceTypeFromValue = function (value) {
    if (Array.isArray(value)) {
        return inferencing_1.InferenceType.ARRAY;
    }
    if (value === null) {
        return inferencing_1.InferenceType.ANY;
    }
    var type = typeof value;
    switch (type) {
        case "object": return inferencing_1.InferenceType.OBJECT;
        case "number": return inferencing_1.InferenceType.NUMBER;
        case "boolean": return inferencing_1.InferenceType.BOOLEAN;
        case "string": return inferencing_1.InferenceType.STRING;
        default: return inferencing_1.InferenceType.ANY;
    }
};
var addDiagnosticError = function (expr, message, context) { return addDiagnostic(expr, parser_utils_1.DiagnosticType.ERROR, message, context); };
var addDiagnostic = function (expr, type, message, context) {
    return __assign({}, context, { diagnostics: context.diagnostics.concat([
            {
                type: parser_utils_1.DiagnosticType.ERROR,
                location: expr.location,
                message: message,
                filePath: context.currentFilePath
            }
        ]) });
};
var lintAttributeValue = function (attribute, context) {
    if (!attribute.value) {
        return setCurrentExprEvalResult(true, attribute, context);
    }
    else if (attribute.value.type === ast_1.PCExpressionType.STRING_BLOCK) {
        var stringBlock = attribute.value;
        for (var i = 0, length_7 = stringBlock.values.length; i < length_7; i++) {
            var block = stringBlock.values[i];
            if (block.type === ast_1.PCExpressionType.BLOCK) {
                context = lintExpr(block, context);
            }
        }
    }
    else if (attribute.value.type === ast_1.PCExpressionType.STRING) {
        context = setCurrentExprEvalResult(attribute.value.value, attribute.value, context);
    }
    else {
        context = lintExpr(attribute.value.value, context);
    }
    return context;
};
var getNestedValue = function (keypath, current, index) {
    if (index === void 0) { index = 0; }
    if (current == null || current.value == null) {
        return current;
    }
    if (index === keypath.length) {
        return current;
    }
    return getNestedValue(keypath, (current.value && current.value[keypath[index]]), index + 1);
};
var getKeypathOrigin = function (keypath, caller) {
    var prop = caller.props[keypath[0]];
    if (prop == null)
        return caller.source;
    var current = prop;
    for (var i = 1, length_8 = keypath.length; i < length_8; i++) {
        var newCurrent = current.value[i];
        if (!newCurrent)
            break;
        current = newCurrent;
    }
    return current.source;
};
var lintExpr = function (expr, context) {
    switch (expr.type) {
        case ast_1.BKExpressionType.OPERATION: {
            var _a = expr, left = _a.left, operator = _a.operator, right = _a.right;
            var topOptional = context.optionalVars;
            if (operator === "||") {
                context = setOptionalVars(true, context);
            }
            context = lintExpr(left, context);
            var lv = context.currentExprEvalResult.value;
            context = lintExpr(right, setOptionalVars(topOptional, context));
            var rv = context.currentExprEvalResult.value;
            switch (operator) {
                case "+": return setCurrentExprEvalResult(lv + rv, expr, context);
                case "-": return setCurrentExprEvalResult(lv - rv, expr, context);
                case "*": return setCurrentExprEvalResult(lv * rv, expr, context);
                case "/": return setCurrentExprEvalResult(lv / rv, expr, context);
                case "%": return setCurrentExprEvalResult(lv % rv, expr, context);
                case "==": return setCurrentExprEvalResult(lv == rv, expr, context);
                case "===": return setCurrentExprEvalResult(lv === rv, expr, context);
                case "!=": return setCurrentExprEvalResult(lv !== rv, expr, context);
                case "!==": return setCurrentExprEvalResult(lv !== rv, expr, context);
                case "||": return setCurrentExprEvalResult(lv || rv, expr, context);
                case "&&": return setCurrentExprEvalResult(lv && rv, expr, context);
                case ">=": return setCurrentExprEvalResult(lv >= rv, expr, context);
                case "<=": return setCurrentExprEvalResult(lv <= rv, expr, context);
            }
            return context;
        }
        case ast_1.BKExpressionType.PROP_REFERENCE:
        case ast_1.BKExpressionType.VAR_REFERENCE: {
            var keypath = inferencing_1.getReferenceKeyPath(expr);
            if (context.caller) {
                var component = (context.components[context.currentComponentId] || {}).component;
                var componentInferenceResult = (component && inferencing_1.inferNodeProps(component.source));
                var origin = getKeypathOrigin(keypath, context.caller);
                var value = getNestedValue(keypath.slice(1), context.caller.props[keypath[0]]);
                console.log(origin);
                context = setCurrentExprEvalResult(value, origin, context);
                if (value === undefined && (keypath.length > 1 || !context.optionalVars)) {
                    context = addDiagnosticError(origin, "Property \"" + keypath.join(".") + "\" is undefined", context);
                }
                else if (componentInferenceResult) {
                    var inference = inferencing_1.getNestedInference(keypath, componentInferenceResult.inference) || inferencing_1.ANY_REFERENCE;
                    var valueType = getInferenceTypeFromValue(value);
                    if (!(inference.type & valueType)) {
                        context = addDiagnosticError(origin, "Type mismatch: attribute \"" + keypath.join(".") + "\" expecting " + inferencing_1.getPrettyTypeLabelEnd(inference.type) + ", " + inferencing_1.getTypeLabels(valueType) + " provided.", context);
                    }
                }
            }
            else {
                context = setCurrentExprEvalResult(null, expr, context);
            }
            return context;
        }
        case ast_1.BKExpressionType.OBJECT: {
            var object = expr;
            var objValue = {};
            for (var i = 0, length_9 = object.properties.length; i < length_9; i++) {
                var _b = object.properties[i], key = _b.key, value = _b.value;
                context = lintExpr(value, context);
                objValue[key] = context.currentExprEvalResult;
            }
            context = setCurrentExprEvalResult(objValue, expr, context);
            return context;
        }
        case ast_1.BKExpressionType.ARRAY: {
            var ary = expr;
            var values = [];
            for (var i = 0, length_10 = ary.values.length; i < length_10; i++) {
                context = lintExpr(ary.values[i], context);
                values.push(context.currentExprEvalResult);
            }
            context = setCurrentExprEvalResult(values, expr, context);
            return context;
        }
        case ast_1.BKExpressionType.NUMBER: {
            var number = expr;
            return setCurrentExprEvalResult(Number(number.value), expr, context);
        }
        case ast_1.BKExpressionType.STRING: {
            var string = expr;
            return setCurrentExprEvalResult(String(string.value), expr, context);
        }
        case ast_1.BKExpressionType.RESERVED_KEYWORD: {
            var value = expr.value;
            if (value === "undefined") {
                return setCurrentExprEvalResult(undefined, expr, context);
            }
            if (value === "null") {
                return setCurrentExprEvalResult(null, expr, context);
            }
            if (value === "true" || value == "false") {
                return setCurrentExprEvalResult(value === "true", expr, context);
            }
            return context;
        }
        case ast_1.BKExpressionType.NOT: {
            var not = expr;
            context = lintExpr(not.value, context);
            return setCurrentExprEvalResult(!context.currentExprEvalResult.value, expr, context);
        }
        case ast_1.BKExpressionType.BIND: {
            var bind = expr;
            return lintExpr(bind.value, __assign({}, context, { currentExprEvalResult: undefined, optionalVars: false }));
        }
        case ast_1.BKExpressionType.IF:
        case ast_1.BKExpressionType.ELSEIF: {
            var _if = expr;
            return lintExpr(_if.condition, __assign({}, context, { currentExprEvalResult: undefined, optionalVars: true }));
        }
        default: {
            return context;
        }
    }
};
var popCaller = function (context) {
    return __assign({}, context, { callstack: context.callstack.slice(0, context.callstack.length - 1), caller: context.callstack[context.callstack.length - 2] });
};
var ignoreTagName = function (tagName, context) {
    return (__assign({}, context, { ignoreTagNames: __assign({}, ignoreTagName, (_a = {}, _a[tagName] = (context.ignoreTagNames[tagName] || 0) + 1, _a)) }));
    var _a;
};
var setCurrentComponentId = function (currentComponentId, context) { return (__assign({}, context, { currentComponentId: currentComponentId })); };
var unignoreTagName = function (tagName, context) {
    return (__assign({}, context, { ignoreTagNames: __assign({}, ignoreTagName, (_a = {}, _a[tagName] = (context.ignoreTagNames[tagName] || 1) - 1, _a)) }));
    var _a;
};
var pushCaller = function (source, filePath, props, context) {
    var caller = {
        filePath: filePath,
        source: source,
        props: props
    };
    return __assign({}, context, { callstack: context.callstack.concat([caller]), caller: caller });
};
var eachValue = function (items, each) {
    if (Array.isArray(items)) {
        items.forEach(each);
    }
    else {
        for (var key in items) {
            each(items[key], key);
        }
    }
};
var setOptionalVars = function (optional, context) { return (__assign({}, context, { optionalVars: optional })); };
var setCurrentExprEvalResult = function (value, source, context) { return (__assign({}, context, { currentExprEvalResult: { value: value, source: source } })); };
//# sourceMappingURL=linting.js.map

/***/ })

})