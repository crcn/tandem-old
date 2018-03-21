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
    context = lintStartTag(startTag, context);
    context = lintNodes(childNodes, context);
    return context;
};
var EMPTY_OBJECT = {};
var lintStartTag = function (startTag, context) {
    var _a = context.components[startTag.name.toLowerCase()] || EMPTY_OBJECT, filePath = _a.filePath, component = _a.component;
    var propInference = {
        type: inferencing_1.InferenceType.ANY,
        properties: {}
    };
    if (!component) {
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
        if (!context.currentExprValue) {
            return context;
        }
        else {
        }
    }
    var currentFilePath = context.currentFilePath;
    if (_repeat) {
        var each = _repeat.each, asValue = _repeat.asValue, asKey = _repeat.asKey;
        var asValueName_1 = asValue.name;
        context = lintExpr(each, context);
        eachValue(context.currentExprValue, function (item, index) {
            context = lintStartTagAttributes(startTag, pushCaller(_repeat, currentFilePath, (_a = {},
                _a[asValueName_1] = item,
                _a), context));
            context = popCaller(context);
            var _a;
        });
    }
    else {
        context = lintStartTagAttributes(startTag, context);
    }
    return context;
};
var lintStartTagAttributes = function (startTag, context) {
    var props = {};
    var prevFilePath = context.currentFilePath;
    var _a = context.components[startTag.name.toLowerCase()] || EMPTY_OBJECT, filePath = _a.filePath, component = _a.component;
    var attributesByKey = {};
    for (var i = 0, length_5 = startTag.attributes.length; i < length_5; i++) {
        var attribute = startTag.attributes[i];
        attributesByKey[attribute.name] = attribute;
    }
    // required props
    for (var propertyName in attributesByKey) {
        var attribute = attributesByKey[propertyName];
        context = lintAttributeValue(attribute, context);
        props[propertyName] = context.currentExprValue;
    }
    for (var i = 0, length_6 = startTag.modifiers.length; i < length_6; i++) {
        var modifier = startTag.modifiers[i].value;
        if (modifier.type === ast_1.BKExpressionType.BIND) {
            var bind = modifier;
            context = lintExpr(bind, context);
            Object.assign(props, context.currentExprValue);
        }
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
var lintAttributeShape = function (expr, keypath, requiredPropInference, providedValue, context) {
    if (providedValue === undefined) {
        if (requiredPropInference.type & inferencing_1.InferenceType.OPTIONAL) {
            return context;
        }
        context = addDiagnosticError(expr, "Missing attribute \"" + keypath.join(".") + "\"", context);
        return context;
    }
    var valueType = getInferenceTypeFromValue(providedValue);
    if (!(requiredPropInference.type & valueType)) {
        context = addDiagnosticError(expr, "Type mismatch: attribute \"" + keypath.join(".") + "\" expecting " + inferencing_1.getPrettyTypeLabelEnd(requiredPropInference.type) + ", " + inferencing_1.getTypeLabels(valueType) + " provided.", context);
    }
    if (requiredPropInference.type !== inferencing_1.InferenceType.ANY && providedValue) {
        for (var key in requiredPropInference.properties) {
            if (key === inferencing_1.EACH_KEY)
                continue;
            context = lintAttributeShape(expr, keypath.concat([key]), requiredPropInference.properties[key], providedValue[key], context);
        }
    }
    return context;
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
        return setCurrentExprValue(true, context);
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
        context = setCurrentExprValue(attribute.value.value, context);
    }
    else {
        context = lintExpr(attribute.value.value, context);
    }
    return context;
};
var getNestedValue = function (keypath, current, index) {
    if (index === void 0) { index = 0; }
    if (current == null) {
        return current;
    }
    if (index === keypath.length) {
        return current;
    }
    return getNestedValue(keypath, current[keypath[index]], index + 1);
};
var lintExpr = function (expr, context) {
    switch (expr.type) {
        case ast_1.BKExpressionType.OPERATION: {
            var _a = expr, left = _a.left, operator = _a.operator, right = _a.right;
            context = lintExpr(left, context);
            var lv = context.currentExprValue;
            context = lintExpr(right, context);
            var rv = context.currentExprValue;
            switch (operator) {
                case "+": return setCurrentExprValue(lv + rv, context);
                case "-": return setCurrentExprValue(lv - rv, context);
                case "*": return setCurrentExprValue(lv * rv, context);
                case "/": return setCurrentExprValue(lv / rv, context);
                case "%": return setCurrentExprValue(lv % rv, context);
                case "==": return setCurrentExprValue(lv == rv, context);
                case "===": return setCurrentExprValue(lv === rv, context);
                case "!=": return setCurrentExprValue(lv !== rv, context);
                case "!==": return setCurrentExprValue(lv !== rv, context);
                case "||": return setCurrentExprValue(lv || rv, context);
                case "&&": return setCurrentExprValue(lv && rv, context);
                case ">=": return setCurrentExprValue(lv >= rv, context);
                case "<=": return setCurrentExprValue(lv <= rv, context);
            }
            return context;
        }
        case ast_1.BKExpressionType.PROP_REFERENCE:
        case ast_1.BKExpressionType.VAR_REFERENCE: {
            var keypath = inferencing_1.getReferenceKeyPath(expr);
            if (context.caller) {
                var component = (context.components[context.currentComponentId] || {}).component;
                var componentInferenceResult = (component && inferencing_1.inferNodeProps(component.source));
                var value = getNestedValue(keypath, context.caller.props);
                context = setCurrentExprValue(value, context);
                console.log(keypath, value, context.optionalVars);
                if (value == null && (keypath.length > 1 || !context.optionalVars)) {
                    context = addDiagnosticError(context.caller.source, "Property \"" + keypath.join(".") + "\" is undefined", context);
                }
                else if (componentInferenceResult) {
                    var inference = inferencing_1.getNestedInference(keypath, componentInferenceResult.inference);
                    console.log(keypath, context.currentComponentId);
                    var valueType = getInferenceTypeFromValue(value);
                    if (!(inference.type & valueType)) {
                        context = addDiagnosticError(context.caller.source, "Type mismatch: attribute \"" + keypath.join(".") + "\" expecting " + inferencing_1.getPrettyTypeLabelEnd(inference.type) + ", " + inferencing_1.getTypeLabels(valueType) + " provided.", context);
                    }
                }
            }
            return context;
        }
        case ast_1.BKExpressionType.OBJECT: {
            var object = expr;
            var value = {};
            for (var i = 0, length_8 = object.properties.length; i < length_8; i++) {
                var _b = object.properties[i], key = _b.key, value_1 = _b.value;
                context = lintExpr(value_1, context);
                value_1[key] = context.currentExprValue;
            }
            context = setCurrentExprValue(value, context);
            return context;
        }
        case ast_1.BKExpressionType.ARRAY: {
            var ary = expr;
            var values = [];
            for (var i = 0, length_9 = ary.values.length; i < length_9; i++) {
                context = lintExpr(ary.values[i], context);
                values.push(context.currentExprValue);
            }
            context = setCurrentExprValue(values, context);
            return context;
        }
        case ast_1.BKExpressionType.NUMBER: {
            var number = expr;
            return setCurrentExprValue(Number(number.value), context);
        }
        case ast_1.BKExpressionType.STRING: {
            var string = expr;
            return setCurrentExprValue(String(string.value), context);
        }
        case ast_1.BKExpressionType.RESERVED_KEYWORD: {
            var value = expr.value;
            if (value === "undefined") {
                return setCurrentExprValue(undefined, context);
            }
            if (value === "null") {
                return setCurrentExprValue(null, context);
            }
            if (value === "true" || value == "false") {
                return setCurrentExprValue(value === "true", context);
            }
            return context;
        }
        case ast_1.BKExpressionType.NOT: {
            var not = expr;
            context = lintExpr(not.value, context);
            return setCurrentExprValue(!context.currentExprValue, context);
        }
        case ast_1.BKExpressionType.BIND: {
            var bind = expr;
            return lintExpr(bind.value, __assign({}, context, { currentExprValue: undefined, optionalVars: false }));
        }
        case ast_1.BKExpressionType.IF:
        case ast_1.BKExpressionType.ELSEIF: {
            var _if = expr;
            return lintExpr(_if.condition, __assign({}, context, { currentExprValue: undefined, optionalVars: true }));
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
var setCurrentExprValue = function (value, context) { return (__assign({}, context, { currentExprValue: value })); };
//# sourceMappingURL=linting.js.map

/***/ }),

/***/ "./src/front-end/components/css-declaration-input.pc":
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing attribute \"returnValue\"\n\n160|     <td-css-call-expr-input [[if value.type === \"CALL\"]] [[bind value]] />\n\n    at /Users/crcn/Developer/work/tandem/public/packages/paperclip-react-transpiler/lib/webpack-loader.js:20:29\n    at process._tickCallback (internal/process/next_tick.js:103:7)");

/***/ }),

/***/ "./src/front-end/components/css-inspector-pane.pc":
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing attribute \"returnValue\"\n\n160|                 {\n\n    at /Users/crcn/Developer/work/tandem/public/packages/paperclip-react-transpiler/lib/webpack-loader.js:20:29\n    at process._tickCallback (internal/process/next_tick.js:103:7)");

/***/ }),

/***/ "./src/front-end/components/windows-pane.pc":
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing attribute \"document\"\n\n37|             <td-windows-pane-row [[bind window]] onClick=[[bind onWindowClicked]] />\n\n    at /Users/crcn/Developer/work/tandem/public/packages/paperclip-react-transpiler/lib/webpack-loader.js:20:29\n    at process._tickCallback (internal/process/next_tick.js:103:7)");

/***/ })

})