"use strict";
// TODO - emit warnings for elements that have invalid IDs, emit errors
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
var loader_1 = require("./loader");
var inferencing_1 = require("./inferencing");
var linting_1 = require("./linting");
exports.bundleVanilla = function (uri, options) { return loader_1.loadModuleDependencyGraph(uri, options.io).then(function (_a) {
    var graph = _a.graph;
    return ({
        code: transpileBundle(uri, graph),
        graph: graph,
        diagnostics: linting_1.lintDependencyGraph(graph).diagnostics,
        entryDependency: graph[uri]
    });
}); };
// usable in other transpilers
exports.transpileBlockExpression = function (expr) {
    switch (expr.type) {
        case ast_1.BKExpressionType.NOT: return "!" + exports.transpileBlockExpression(expr.value);
        case ast_1.BKExpressionType.PROP_REFERENCE: {
            var ref = expr;
            return ref.path.map(exports.transpileBlockExpression).join(".");
        }
        case ast_1.BKExpressionType.STRING: {
            var string = expr;
            return JSON.stringify(string.value);
        }
        case ast_1.BKExpressionType.NUMBER: {
            var number = expr;
            return number.value;
        }
        case ast_1.BKExpressionType.VAR_REFERENCE: {
            var ref = expr;
            return ref.name;
        }
        case ast_1.BKExpressionType.ARRAY: {
            var array = expr;
            return "[" + array.values.map(exports.transpileBlockExpression) + "]";
        }
        case ast_1.BKExpressionType.OBJECT: {
            var object = expr;
            var content = "{";
            for (var i = 0, length_1 = object.properties.length; i < length_1; i++) {
                var property = object.properties[i];
                content += property.key + ":" + exports.transpileBlockExpression(property.value) + ", ";
            }
            content += "}";
            return content;
        }
        case ast_1.BKExpressionType.GROUP: return "(" + exports.transpileBlockExpression(expr.value) + ")";
        case ast_1.BKExpressionType.RESERVED_KEYWORD: return expr.value;
        case ast_1.BKExpressionType.OPERATION: {
            var _a = expr, left = _a.left, operator = _a.operator, right = _a.right;
            return exports.transpileBlockExpression(left) + " " + operator + " " + exports.transpileBlockExpression(right);
        }
        default: {
            throw new Error("Unable to transpile BK block " + expr.type);
        }
    }
};
var getJSFriendlyName = function (name) { return name.replace(/[\d-]+/g, "_"); };
var transpileBundle = function (entryUri, graph) {
    // TODO - resolve dependencies
    var content = "((window) => {";
    content += "" +
        "var document = window.document;" +
        "const __each = (object, iterator) => {" +
        "if (Array.isArray(object)) {" +
        "object.forEach(iterator);" +
        "} else {" +
        "for (const key in object) {" +
        "iterator(object[key], key);" +
        "}" +
        "}" +
        "};" +
        "const __count = (object) => {" +
        "return Array.isArray(object) ? object.length : Object.keys(object).length;" +
        "};" +
        "const __defineModule = (run) => {" +
        "let exports;" +
        "return () => {" +
        "if (exports) return exports;" +
        // guard from recursive dependencies
        "exports = {};" +
        "return exports = run((dep) => {" +
        "return $$modules[dep]()" +
        "});" +
        "}" +
        "};" +
        "const __setElementProperty = (element, property, value) => {" +
        "if (property === \"style\" && typeof value !== \"string\") {\n" +
        "element.style = \"\";\n" +
        "Object.assign(element.style, value);\n" +
        "} else {\n" +
        "element[property] = value;" +
        "}\n" +
        "};" +
        "let updating = false;" +
        "let toUpdate = [];" +
        "const __requestUpdate = (object) => {" +
        "if (toUpdate.indexOf(object) === -1) {" +
        "toUpdate.push(object);" +
        "}" +
        "if (updating) {" +
        "return;" +
        "}" +
        "updating = true;" +
        "requestAnimationFrame(function() {" +
        "for(let __i = 0; i < toUpdate.length; __i++) {" +
        "const target = toUpdate[__i];" +
        "target.update();" +
        "}" +
        "toUpdate = [];" +
        "updating = false;" +
        "});" +
        "};";
    content += "$$modules = {};";
    var componentAliases = getComponentAliases(graph);
    for (var uri in graph) {
        var _a = graph[uri], resolvedImportUris = _a.resolvedImportUris, module = _a.module;
        content += "$$modules[\"" + uri + "\"] = " + transpileModule(module, resolvedImportUris, componentAliases) + ";";
    }
    content += "const entry = $$modules[\"" + entryUri + "\"]();";
    content += "return {" +
        "entry," +
        "modules: $$modules" +
        "};" +
        "})(window)";
    return content;
};
var getComponentAliases = function (graph) {
    var aliases = {};
    var allComponents = loader_1.getAllComponents(graph);
    for (var id in allComponents) {
        aliases[id] = getComponentTagName(id);
    }
    return aliases;
};
var transpileModule = function (module, resolvedImportUris, aliases) {
    var uri = module.uri, source = module.source;
    var context = {
        uri: uri,
        aliases: aliases,
        varCount: 0,
        root: source
    };
    // TODO - include deps here
    var content = "__defineModule((require) => {";
    content += "var $$previews = {};";
    if (module.type === loader_1.PCModuleType.COMPONENT) {
        var _a = module, imports = _a.imports, globalStyles = _a.globalStyles, components = _a.components, unhandledExpressions = _a.unhandledExpressions;
        var styleDecls = transpileChildNodes(globalStyles, context);
        for (var i = 0, length_2 = styleDecls.length; i < length_2; i++) {
            var decl = styleDecls[i];
            content += decl.content;
            content += "document.body.appendChild(" + decl.varName + ");";
        }
        for (var i = 0, length_3 = imports.length; i < length_3; i++) {
            var _import = imports[i];
            var decl = declare("import", "require(" + JSON.stringify(resolvedImportUris[_import.href]) + ")", context);
            content += decl.content;
        }
        for (var i = 0, length_4 = components.length; i < length_4; i++) {
            content += tranpsileComponent(components[i], context).content;
        }
    }
    else if (module.type === loader_1.PCModuleType.CSS) {
        var ast = source;
        var decl = declareNode("document.createElement(\"style\")", context);
        decl.content += exports.addStyleElementSheet(ast, decl.varName, context);
        content += decl.content;
    }
    content += "return {" +
        "previews: $$previews" +
        "};";
    content += "})";
    return content;
};
var wrapTranspiledStatement = function (statement) { return "(() => {" + statement + "} )();\n"; };
var wrapAndCallBinding = function (binding) { return "(() => { const binding = () => { " + binding + " }; binding(); return binding; })()"; };
var tranpsileComponent = function (_a, context) {
    var previews = _a.previews, source = _a.source, id = _a.id, style = _a.style, template = _a.template;
    var varName = createVarName(getJSFriendlyName(id), context);
    var tagName = getComponentTagName(id);
    var templateContext = __assign({}, context, { varCount: 0, contextName: "this" });
    var properties = Object.keys(inferencing_1.inferNodeProps(source).inference.properties);
    var styleDecl = style && exports.transpileStyleElement(style, templateContext);
    var content = "" +
        ("class " + varName + " extends HTMLElement {") +
        "constructor() {" +
        "super();" +
        "this.__bindings = [];" +
        "}" +
        "connectedCallback() {" +
        "this.render();" +
        "}" +
        properties.map(function (name) {
            return "" +
                ("get " + name + "() {") +
                ("return this.__" + name + ";") +
                "}" +
                ("set " + name + "(value) {") +
                ("if (this.__" + name + " === value || String(this.__" + name + ") === String(value)) {") +
                "return;" +
                "}" +
                ("const oldValue = this.__" + name + ";") +
                ("this.__" + name + " = value;") +
                // primitive data types only
                "if (typeof value !== \"object\") {" +
                ("this.setAttribute(" + JSON.stringify(name) + ", value);") +
                "}" +
                "if (this._rendered) {" +
                "__requestUpdate(this);" +
                "}" +
                "}";
        }).join("\n") +
        "render() {" +
        "if (this._rendered) {" +
        "return;" +
        "}" +
        "this._rendered = true;" +
        "const shadow = this.attachShadow({ mode: \"open\" });" +
        (styleDecl ? styleDecl.content + ("shadow.appendChild(" + styleDecl.varName + ");") : "") +
        properties.map(function (name) { return ("if (this.__" + name + " == null) {" +
            ("this.__" + name + " = this.getAttribute(\"" + name + "\");") +
            "}"); }).join("\n") +
        "let __bindings = [];" +
        (template ? template.childNodes.map(function (node) {
            var decl = transpileExpression(node, templateContext);
            if (!node || !decl) {
                return "";
            }
            return ("" + decl.content +
                (decl.bindings.length ? "__bindings = __bindings.concat(" + decl.bindings.map(function (binding) { return "(() => {" +
                    "const __binding = () => {" +
                    ("const { " + properties.join(",") + " } = this;") +
                    binding +
                    "};" +
                    "__binding();" +
                    "return __binding;" +
                    "})()"; }).join(",") + ");" : "") +
                ("shadow.appendChild(" + decl.varName + ");"));
        }).join("") : "") +
        "this.__bindings = __bindings;" +
        "}" +
        "cloneShallow() {" +
        "const clone = super.cloneShallow();" +
        // for tandem only
        "clone._rendered = true;" +
        "return clone;" +
        "}" +
        "static get observedAttributes() {" +
        ("return " + JSON.stringify(properties) + ";") +
        "}" +
        "attributeChangedCallback(name, oldValue, newValue) {" +
        "if (super.attributeChangedCallback) {" +
        "super.attributeChangedCallback(name, oldValue, newValue);" +
        "}" +
        "this[name] = newValue;" +
        "}" +
        "update() {" +
        "if (!this._rendered) {" +
        "return;" +
        "}" +
        "let bindings = this.__bindings || [];" +
        transpileBindingsCall("bindings") +
        "}" +
        "}" +
        (
        // paperclip linter will catch cases where there is more than one 
        // registered component in a project. This shouldn't block browsers from loading
        // paperclip files (especially needed when loading multiple previews in the same window)
        "if (!customElements.get(\"" + tagName + "\")) {") +
        ("customElements.define(\"" + tagName + "\", " + varName + ");") +
        "} else {" +
        ("console.error(\"Custom element \\\"" + tagName + "\\\" is already defined, ignoring\");") +
        "}";
    content += "$$previews[\"" + id + "\"] = {};";
    previews.forEach(function (preview) {
        var name = preview.name;
        var child = preview.source.childNodes.find(function (child) { return child.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT || child.type === ast_1.PCExpressionType.ELEMENT; });
        if (!child) {
            return;
        }
        var decl = transpileExpression(child, __assign({}, context, { aliases: __assign({}, context.aliases, { preview: id }) }));
        content += "$$previews[\"" + id + "\"][\"" + name + "\"] = () => {" +
            decl.content +
            decl.bindings.map(function (binding) { return "(() => {" + binding + "})();"; }).join("") +
            ("return " + decl.varName + ";") +
            "};";
    });
    return {
        varName: varName,
        bindings: [],
        content: content
    };
};
var getComponentTagName = function (id) { return "x-" + id; };
var transpileExpression = function (ast, context) {
    switch (ast.type) {
        case ast_1.PCExpressionType.FRAGMENT: return transpileFragment(ast, context);
        case ast_1.PCExpressionType.TEXT_NODE: return transpileTextNode(ast, context);
        case ast_1.PCExpressionType.BLOCK: return transpileTextBlock(ast, context);
        case ast_1.PCExpressionType.ELEMENT: return transpileElement(ast, context);
        case ast_1.PCExpressionType.SELF_CLOSING_ELEMENT: return transpileSelfClosingElement(ast, context);
    }
    return null;
};
var transpileExpressions = function (asts, context) { return asts.map(function (ast) { return transpileExpression(ast, context); }); };
var transpileFragment = function (ast, context) {
    var fragment = declareNode("document.createDocumentFragment(\"\")", context);
    // TODO
    return fragment;
};
var transpileTextNode = function (ast, context) {
    // create text node without excess whitespace (doesn't get rendered)
    return attachSource(declareNode("document.createTextNode(" + JSON.stringify(ast.value.replace(/[\s\r\n\t]+/g, " ")) + ")", context), ast, context);
};
var transpileTextBlock = function (ast, context) {
    var node = declareNode("document.createTextNode(\"\")", context);
    node = attachSource(node, ast, context);
    var bindingVarName = node.varName + "$$currentValue";
    node.content += "let " + bindingVarName + ";";
    node.bindings.push(transpileBinding(bindingVarName, exports.transpileBlockExpression(ast.value.value), function (assignment) { return node.varName + ".nodeValue = " + assignment; }, context));
    return node;
};
var transpileSelfClosingElement = function (ast, context) {
    return transpileElementModifiers(ast, attachSource(transpileStartTag(ast, context), ast, context), context);
};
var transpileElementModifiers = function (startTag, decl, context) {
    if (!startTag.modifiers.length) {
        return decl;
    }
    var modifiers = startTag.modifiers;
    var newDeclaration = decl;
    var _if;
    var _else;
    var _elseif;
    var _repeat;
    var _bind; // spread op in this case
    for (var i = 0, length_5 = modifiers.length; i < length_5; i++) {
        var modifier = modifiers[i].value;
        if (modifier.type === ast_1.BKExpressionType.IF) {
            _if = modifier;
        }
        else if (modifier.type === ast_1.BKExpressionType.ELSE) {
            _else = modifier;
        }
        else if (modifier.type === ast_1.BKExpressionType.ELSEIF) {
            _elseif = modifier;
        }
        else if (modifier.type === ast_1.BKExpressionType.REPEAT) {
            _repeat = modifier;
        }
        else if (modifier.type === ast_1.BKExpressionType.BIND) {
            _bind = modifier;
        }
    }
    if (_bind) {
        var value = _bind.value;
        newDeclaration = {
            varName: decl.varName,
            content: decl.content,
            bindings: decl.bindings.slice()
        };
        var spreadVarName_1 = newDeclaration.varName + "$$spreadValue";
        var assignment = exports.transpileBlockExpression(value);
        newDeclaration.content += "let " + spreadVarName_1 + ";";
        newDeclaration.bindings.push(transpileBinding(spreadVarName_1, assignment, function (assignment) { return ("" +
            ("for (const __key in " + spreadVarName_1 + ") {") +
            ("__setElementProperty(" + decl.varName + ", __key, " + spreadVarName_1 + "[__key]);") +
            "}" +
            ""); }, context));
        decl = newDeclaration;
    }
    // todo - eventually want to get TYPE of each declaration
    // here so that transpiling can be done for objects, or arrays.
    if (_repeat) {
        var each = _repeat.each, asKey = _repeat.asKey, asValue = _repeat.asValue;
        var _each = exports.transpileBlockExpression(each);
        var _asKey_1 = asKey ? exports.transpileBlockExpression(asKey) : "index";
        var _asValue_1 = exports.transpileBlockExpression(asValue);
        // newDeclaration = declareNode(`document.createTextNode("")`, context);
        var _a = declareVirtualFragment(context), fragment = _a.fragment, start = _a.start, end = _a.end;
        newDeclaration = fragment;
        var currentValueVarName = newDeclaration.varName + "$$currentValue";
        var childBindingsVarName = newDeclaration.varName + "$$childBindings";
        newDeclaration.content += ("let " + currentValueVarName + " = [];" +
            ("let " + childBindingsVarName + " = [];"));
        newDeclaration.bindings.push("" +
            ("let $$newValue = (" + _each + ") || [];") +
            ("if ($$newValue === " + currentValueVarName + ") {") +
            "return;" +
            "}" +
            ("const $$oldValue = " + currentValueVarName + ";") +
            (currentValueVarName + " = $$newValue;") +
            ("const $$parent = " + start.varName + ".parentNode;") +
            ("const $$startIndex = Array.prototype.indexOf.call($$parent.childNodes, " + start.varName + "); ") +
            // insert
            "const $$newValueCount = __count($$newValue);" +
            "const $$oldValueCount = __count($$oldValue);" +
            "if ($$newValueCount > $$oldValueCount) {" +
            "for (let __i = $$newValueCount - $$oldValueCount; __i--;) {" +
            decl.content +
            ("$$parent.insertBefore(" + decl.varName + ", " + end.varName + ");") +
            ("const __bindings = [" + decl.bindings.map(function (binding) { return ("(" + _asValue_1 + ", " + _asKey_1 + ") => { " +
                binding +
                "}"); }).join(",") + "];") +
            (childBindingsVarName + ".push(($$newValue, $$newKey) => {") +
            ("" + transpileBindingsCall("__bindings", "$$newValue, $$newKey")) +
            "});" +
            "}" +
            // delete
            "} else if ($$oldValue.length < $$newValue.length) {" +
            // TODO
            "}" +
            "let __i = 0;" +
            // update
            "__each($$newValue, (value, k) => {" +
            (childBindingsVarName + "[__i++](value, k);") +
            "});");
        decl = newDeclaration;
    }
    // conditions must come after repeat
    if (_if || _elseif || _else) {
        var modifier = (_if || _elseif || _else);
        var condition = modifier.condition;
        var siblings = context.root === startTag || context.root.startTag === startTag ? [context.root] : ast_1.getPCParent(context.root, startTag).childNodes;
        var index = siblings.findIndex(function (sibling) {
            return sibling === startTag || (startTag.type === ast_1.PCExpressionType.START_TAG && sibling.type === ast_1.PCExpressionType.ELEMENT && sibling.startTag === startTag);
        });
        var conditionBlockVarName = void 0;
        for (var i = index + 1; i--;) {
            var sibling = siblings[i];
            if (ast_1.isTag(sibling) && ast_1.getPCElementModifier(sibling, ast_1.BKExpressionType.IF)) {
                conditionBlockVarName = "condition_" + ast_1.getExpressionPath(sibling, context.root).join("");
                break;
            }
        }
        if (!conditionBlockVarName) {
            throw new Error("Element condition " + ast_1.BKExpressionType[modifier.type] + " defined without an IF block.");
        }
        var _b = declareVirtualFragment(context), fragment = _b.fragment, start = _b.start, end = _b.end;
        newDeclaration = fragment;
        var bindingsVarName = newDeclaration.varName + "__bindings";
        var currentValueVarName = newDeclaration.varName + "$$currentValue";
        fragment.content += "" +
            ("let " + bindingsVarName + " = [];") +
            ("let " + currentValueVarName + " = false;");
        if (_if) {
            fragment.content += "let " + conditionBlockVarName + " = Infinity;";
        }
        newDeclaration.bindings.push("" +
            ("const newValue = Boolean(" + (condition ? exports.transpileBlockExpression(condition) : "true") + ") && " + conditionBlockVarName + " >= " + index + ";") +
            "if (newValue) {" +
            (conditionBlockVarName + " = " + index + ";") +
            (
            // give it up for other conditions
            "} else if (" + conditionBlockVarName + " === " + index + ") {") +
            (conditionBlockVarName + " = Infinity;") +
            "}" +
            ("if (newValue && newValue === " + currentValueVarName + ") {") +
            ("if (" + currentValueVarName + ") {") +
            ("" + transpileBindingsCall(bindingsVarName)) +
            "}" +
            "return;" +
            "}" +
            (currentValueVarName + " = newValue;") +
            (bindingsVarName + " = [];") +
            "if (newValue) {" +
            "const elementFragment = document.createDocumentFragment();" +
            ("" + decl.content) +
            (decl.bindings.length ? bindingsVarName + " = " + bindingsVarName + ".concat(" + decl.bindings.map(wrapAndCallBinding).join(",") + ");" : "") +
            ("elementFragment.appendChild(" + decl.varName + ");") +
            (end.varName + ".parentNode.insertBefore(elementFragment, " + end.varName + ");") +
            "} else {" +
            ("let curr = " + start.varName + ".nextSibling;") +
            ("while(curr !== " + end.varName + ") {") +
            "curr.parentNode.removeChild(curr);" +
            ("curr = " + start.varName + ".nextSibling;") +
            "}" +
            "}");
    }
    return newDeclaration;
};
var transpileStartTag = function (ast, context) {
    var element = declareNode("document.createElement(\"" + (context.aliases[ast.name.toLowerCase()] || ast.name) + "\")", context);
    var _loop_1 = function (i, length_6) {
        var _a = ast.attributes[i], name_1 = _a.name, value = _a.value;
        var propName = getJSFriendlyName(name_1);
        if (!value) {
            element.content += element.varName + ".setAttribute(\"" + name_1 + "\", \"true\");";
        }
        else if (value.type === ast_1.PCExpressionType.STRING) {
            var string = value;
            element.content += element.varName + ".setAttribute(\"" + name_1 + "\", " + JSON.stringify(string.value) + ");\n";
        }
        else if (value.type === ast_1.PCExpressionType.STRING_BLOCK || value.type === ast_1.PCExpressionType.BLOCK) {
            // TODO - check for [[on ]]
            var bindingVarName = element.varName + "$$" + propName + "$$currentValue";
            element.content += "let " + bindingVarName + ";\n";
            var binding = void 0;
            if (value.type === ast_1.PCExpressionType.STRING_BLOCK) {
                var stringBlock = value;
                binding = transpileBinding(bindingVarName, stringBlock.values.map(function (value) {
                    if (value.type === ast_1.PCExpressionType.BLOCK) {
                        // todo - assert BIND here
                        return exports.transpileBlockExpression(value.value.value);
                    }
                    else {
                        return JSON.stringify(value.value);
                    }
                }).join(" + "), function (assignment) { return (element.varName + ".setAttribute(\"" + name_1 + "\", " + assignment + ")"); }, context);
            }
            else {
                binding = transpileBinding(bindingVarName, exports.transpileBlockExpression(value.value.value), function (assignment) { return "__setElementProperty(" + element.varName + ", \"" + propName + "\", " + assignment + ")"; }, context);
            }
            element.bindings.push(binding);
        }
    };
    for (var i = 0, length_6 = ast.attributes.length; i < length_6; i++) {
        _loop_1(i, length_6);
    }
    return element;
};
var transpileBinding = function (bindingVarName, assignment, createStatment, context) {
    return ("let $$newValue = " + assignment + ";" +
        ("if ($$newValue !== " + bindingVarName + ") {") +
        (bindingVarName + " = $$newValue;") +
        ("" + createStatment(bindingVarName)) +
        "}");
};
var transpileBindingsCall = function (bindingsVarName, args) {
    if (args === void 0) { args = ''; }
    return ("for (let __i = 0, n = " + bindingsVarName + ".length; __i < n; __i++) {" +
        (bindingsVarName + "[__i](" + args + ");") +
        "}");
};
var transpileElement = function (ast, context) {
    switch (ast.startTag.name) {
        case "style": return exports.transpileStyleElement(ast, context);
        default: return transpileElementModifiers(ast.startTag, transpileNativeElement(ast, context), context);
    }
};
exports.transpileStyleElement = function (ast, context) {
    var decl = declareNode("document.createElement(\"style\")", context);
    decl = attachSource(decl, ast, context);
    decl.content += exports.addStyleElementSheet(ast.childNodes[0], decl.varName, context);
    return decl;
};
exports.addStyleElementSheet = function (ast, varName, context) {
    var content = "";
    content += "" +
        "if (window.$synthetic) {";
    var sheetDecl = transpileNewCSSSheet(ast, context);
    content += sheetDecl.content +
        (varName + ".$$setSheet(" + sheetDecl.varName + ");");
    // todo - need to create style rules
    content += "" +
        "} else {" +
        (
        // todo - need to stringify css
        varName + ".textContent = " + JSON.stringify(exports.transpileCSSSheet(ast, function (value, rule) { return translateSelectorText(value, context); })) + ";") +
        "}";
    return content;
};
var transpileNewCSSSheet = function (sheet, context) {
    var childDecls = transpileNewCSSRules(sheet.children, context);
    var decl = declareRule("new CSSStyleSheet([" + childDecls.map(function (decl) { return decl.varName; }).join(",") + "])", context);
    decl = attachSource(decl, sheet, context);
    decl.content = childDecls.map(function (decl) { return decl.content; }).join("\n") + decl.content;
    return decl;
};
var transpileNewCSSRules = function (rules, context) { return rules.map(function (rule) { return transpileNewCSSRule(rule, context); }).filter(Boolean); };
var transpileNewCSSRule = function (rule, context) {
    switch (rule.type) {
        case ast_1.CSSExpressionType.AT_RULE: return transpileNewCSSAtRule(rule, context);
        case ast_1.CSSExpressionType.STYLE_RULE: return transpileNewCSSStyleRule(rule, context);
    }
    throw new Error("Unexpected rule " + rule.type);
};
var transpileNewCSSAtRule = function (rule, context) {
    switch (rule.name) {
        case "media": return transpileNewMediaRule(rule, context);
        case "keyframes": return transpileNewKeyframesRule(rule, context);
        case "font-face": return transpileNewFontFaceRule(rule, context);
        case "import": return transpileNewImportRule(rule, context);
        case "charset": return transpileNewCharsetRule(rule, context);
    }
};
var transpileNewMediaRule = function (rule, context) { return transpileNewAtGroupingRule(rule, context, "CSSMediaRule", transpileNewCSSStyleRule); };
var transpileNewFontFaceRule = function (rule, context) {
    return attachSource(declareRule("new CSSFontFaceRule(" + transpileStyleDeclaration(getCSSDeclarationProperties(rule), context) + ")", context), rule, context);
};
var getCSSDeclarationProperties = function (rule) { return rule.children.filter(function (child) { return child.type === ast_1.CSSExpressionType.DECLARATION_PROPERTY; }); };
var transpileNewKeyframesRule = function (rule, context) { return transpileNewAtGroupingRule(rule, context, "CSSKeyframesRule", transpileKeyframe); };
var transpileNewAtGroupingRule = function (rule, context, constructorName, transpileChild) {
    var childDecls = rule.children.map(function (rule) { return transpileChild(rule, context); }).filter(Boolean);
    var decl = declareRule("new " + constructorName + "(" + JSON.stringify(rule.params.join(" ")) + ", [" + childDecls.map(function (decl) { return decl.varName; }).join(",") + "])", context);
    decl.content = childDecls.map(function (decl) { return decl.content; }).join("\n") + decl.content;
    return decl;
};
var transpileKeyframes = function (rules, context) { return rules.map(function (rule) { return transpileKeyframe(rule, context); }).filter(Boolean); };
var transpileKeyframe = function (styleRule, context) { return transpileNewCSSStyledRule(styleRule, "CSSKeyframeRule", context); };
var transpileNewImportRule = function (rule, context) {
    // imported up top
    return null;
};
var transpileNewCharsetRule = function (rule, context) {
    return null; // for now
};
var transpileNewCSSStyledRule = function (rule, constructorName, context) {
    return declareRule("new " + constructorName + "(" + JSON.stringify(translateSelectorText(rule.selectorText, context)) + ", " + transpileStyleDeclaration(getCSSDeclarationProperties(rule), context) + ")", context);
};
var translateSelectorText = function (selectorText, _a) {
    var aliases = _a.aliases;
    var newSelectorText = selectorText;
    // do not transpile in now -- neg lookbehind regex dosesn't work in this environment. Only 
    // in modern browsers.
    if (typeof process !== "undefined") {
        return newSelectorText;
    }
    for (var id in aliases) {
        newSelectorText = newSelectorText.replace(new RegExp("(?<!x-)" + id, "g"), aliases[id]);
    }
    return newSelectorText;
};
var transpileNewCSSStyleRule = function (rule, context) { return transpileNewCSSStyledRule(rule, "CSSStyleRule", context); };
var transpileStyleDeclaration = function (declarationProperties, context) {
    var content = "{";
    for (var _i = 0, declarationProperties_1 = declarationProperties; _i < declarationProperties_1.length; _i++) {
        var property = declarationProperties_1[_i];
        content += "\"" + property.name + "\":" + JSON.stringify(property.value) + ", ";
    }
    content += "}";
    return "CSSStyleDeclaration.fromObject(" + content + ")";
};
exports.transpileCSSSheet = function (sheet, mapSelectorText) {
    if (mapSelectorText === void 0) { mapSelectorText = function (value) { return value; }; }
    return sheet.children.map(function (rule) { return transpileCSSRule(rule, mapSelectorText); }).filter(Boolean).join(" ");
};
var transpileCSSRule = function (rule, mapSelectorText) {
    // TODO - prefix here for scoped styling
    switch (rule.type) {
        case ast_1.CSSExpressionType.AT_RULE: {
            var atRule = rule;
            if (atRule.name === "charset" || atRule.name === "import")
                return null;
            var content = "@" + atRule.name + " " + atRule.params.join("") + " {";
            content += atRule.children.map(function (rule) { return transpileCSSRule(rule, mapSelectorText); }).filter(Boolean).join(" ");
            content += "}";
            return content;
        }
        case ast_1.CSSExpressionType.DECLARATION_PROPERTY: {
            var prop = rule;
            return prop.name + ": " + prop.value + ";";
        }
        case ast_1.CSSExpressionType.STYLE_RULE: {
            var styleRule = rule;
            var content = mapSelectorText(styleRule.selectorText, styleRule) + " {";
            content += styleRule.children.map(function (rule) { return transpileCSSRule(rule, mapSelectorText); }).filter(Boolean).join("");
            content += "}";
            return content;
        }
    }
};
var transpileChildNodes = function (childNodes, context) {
    var childDecls = [];
    for (var i = 0, length_7 = childNodes.length; i < length_7; i++) {
        var child = childNodes[i];
        // ignore whitespace squished between elements
        if (child.type === ast_1.PCExpressionType.TEXT_NODE && /^[\s\r\n\t]+$/.test(child.value)) {
            var prev = childNodes[i - 1];
            var next = childNodes[i + 1];
            // <span><span /> </span>
            if ((!prev || ast_1.isTag(prev)) && (!next || ast_1.isTag(next))) {
                continue;
            }
        }
        var decl = transpileExpression(child, context);
        if (!decl)
            continue;
        childDecls.push(decl);
    }
    return childDecls;
};
var transpileNativeElement = function (ast, context) {
    var element = transpileStartTag(ast.startTag, context);
    element = attachSource(element, ast, context);
    var childDecls = transpileChildNodes(ast.childNodes, context);
    for (var i = 0, length_8 = childDecls.length; i < length_8; i++) {
        var childDecl = childDecls[i];
        element.content += childDecl.content;
        element.content += element.varName + ".appendChild(" + childDecl.varName + ");\n";
        (_a = element.bindings).push.apply(_a, childDecl.bindings);
    }
    return element;
    var _a;
};
var declare = function (baseName, assignment, context) {
    var varName = createVarName(baseName, context);
    return {
        varName: varName,
        bindings: [],
        content: assignment ? "let " + varName + " = " + assignment + ";\n" : "let " + varName + ";\n"
    };
};
var createVarName = function (baseName, context) { return baseName + "_" + context.varCount++; };
var declareNode = function (assignment, context) { return declare("node", assignment, context); };
var declareRule = function (assignment, context) { return declare("rule", assignment, context); };
var declareVirtualFragment = function (context) {
    var fragment = declareNode("document.createDocumentFragment(\"\")", context);
    var start = declareNode("document.createTextNode(\"\")", context);
    var end = declareNode("document.createTextNode(\"\")", context);
    fragment.content += ("" + start.content +
        ("" + end.content) +
        (fragment.varName + ".appendChild(" + start.varName + ");") +
        (fragment.varName + ".appendChild(" + end.varName + ");"));
    return {
        fragment: fragment,
        start: start,
        end: end
    };
};
var attachSource = function (decl, expr, context) {
    var source = __assign({ uri: context.uri, type: expr.type }, expr.location);
    decl.content += decl.varName + ".source = " + JSON.stringify(source) + ";";
    return decl;
};
//# sourceMappingURL=vanilla-transpiler.js.map