"use strict";
/*

TODOS:

- CSS piercing
- :host styles
- style components
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
var paperclip_1 = require("paperclip");
var slim_dom_1 = require("slim-dom");
var utils_1 = require("./utils");
exports.transpileToReactComponents = function (graph, entryUri) {
    return transpileModule(graph[entryUri], graph);
};
var transpileModule = function (entry, graph) {
    var content = "";
    var module = entry.module;
    var componentInfo = module.components.map(utils_1.getComponentTranspileInfo);
    content += "import * as React from \"react\";\n";
    var allDeps = paperclip_1.getUsedDependencies(entry, graph);
    var allImports = utils_1.getImportsInfo(entry, allDeps);
    var imported = {};
    allImports.forEach(function (_a) {
        var varName = _a.varName, relativePath = _a.relativePath, dependency = _a.dependency;
        imported[dependency.module.uri] = true;
        content += "import * as " + varName + " from \"" + relativePath + "\";\n";
    });
    // include remaining imports that are explicitly defined
    // so that they can inject content into the page
    for (var importUri in entry.resolvedImportUris) {
        var dep = graph[entry.resolvedImportUris[importUri]];
        if (imported[dep.module.uri])
            continue;
        content += "import \"" + importUri + "\";\n";
    }
    content += "\n";
    content += "const identity = value => value;\n\n";
    content += "" +
        "const defaults = (initial, overrides) => {\n" +
        "  const result = Object.assign({}, initial);\n" +
        "  for (const key in overrides) {\n" +
        "    const value = overrides[key];\n" +
        "    if (value != null) {\n" +
        "      result[key] = value;\n" +
        "    }\n" +
        "  }\n" +
        "  return result;\n" +
        "};\n\n";
    content += "" +
        "const __getDataProps = (props) => {\n" +
        "  const ret = {};\n" +
        "  for (const key in props) {\n" +
        "    if (props[key]) {\n" +
        "      ret[\"data-\" + key] = true;\n" +
        "    }\n" +
        "  }\n" +
        "  return ret;\n" +
        "};\n\n";
    // TODO - inject styles into the document body.
    for (var i = 0, length_1 = module.globalStyles.length; i < length_1; i++) {
        content += transpileStyle(module.globalStyles[i]);
    }
    // TODO - inject styles into the document body.
    for (var i = 0, length_2 = module.components.length; i < length_2; i++) {
        content += transpileComponent(utils_1.getComponentTranspileInfo(module.components[i]), graph, allImports);
    }
    return content;
};
var transpileComponent = function (_a, graph, imports) {
    var component = _a.component, className = _a.className;
    var content = "";
    var childComponentInfo = paperclip_1.getChildComponentInfo(component.template, graph);
    var context = {
        scopeClass: className,
        scope: component.template,
        elementFactoryName: "React.createElement",
        graph: graph,
        imports: imports,
        childComponentInfo: childComponentInfo
    };
    content += transpileStyle(component.style, context.scopeClass, component, childComponentInfo);
    content += "export const hydrate" + className + " = (enhance, hydratedChildComponentClasses = {}) => {\n";
    if (Object.keys(childComponentInfo).length) {
        // provide defaults if child components are not provided in the hydration function. This 
        // here partially to ensure that newer updates don't bust application code. (i.e: if a designer adds a new view, they chould be able to compile the application without needing enhancement code)
        content += "  const baseComponentClasses = {\n";
        for (var id in childComponentInfo) {
            var childDep = childComponentInfo[id];
            var info = utils_1.getComponentTranspileInfo(utils_1.getComponentFromModule(id, childDep.module));
            var _import = utils_1.getImportFromDependency(imports, childDep);
            content += "    " + info.className + ": " + (_import ? _import.varName + "." : "") + "Base" + info.className + ",\n";
        }
        content += "  };\n\n";
        content += "  const childComponentClasses = defaults(baseComponentClasses, hydratedChildComponentClasses);";
    }
    var componentPropertyNames = Object.keys(paperclip_1.inferNodeProps(component.source).inference.properties);
    // Note that props need to be added to the host element since 
    // items like click handlers need to pass through
    var hostContent = context.elementFactoryName + "(\"span\", Object.assign({}, props, { className: \"" + context.scopeClass + "_host \" + (props.className || \"\") }, __getDataProps(props)), " +
        ("  " + component.template.childNodes.map(function (node) { return transpileNode(node, context); }).filter(Boolean).join(",")) +
        ")";
    content += "";
    var fnInner = wrapRenderFunctionInner(hostContent, component.template.childNodes, context);
    var deconstructPropNames = componentPropertyNames.concat(utils_1.getTemplateSlotNames(component.template));
    content += "  return enhance((props) => {" +
        (deconstructPropNames.length ? "  const { " + deconstructPropNames.join(", ") + " } = props;" : "") +
        ("  " + fnInner) +
        "});\n";
    content += "};\n\n";
    content += "let _Base" + className + ";\n";
    content += "export const Base" + className + " = (props) => (_Base" + className + " || (_Base" + className + " = hydrate" + className + "(identity)))(props);\n\n";
    return content;
};
var transpileStyle = function (style, scopeClass, component, childComponentInfo) {
    if (childComponentInfo === void 0) { childComponentInfo = {}; }
    var aliases = {};
    for (var componentId in childComponentInfo) {
        var dep = childComponentInfo[componentId];
        aliases[componentId] = "." + utils_1.getComponentTranspileInfo(paperclip_1.getModuleComponent(componentId, dep.module)).className;
    }
    var componentProps = component && Object.keys(paperclip_1.inferNodeProps(component.source).inference.properties) || [];
    if (!style) {
        return "";
    }
    var sheet = style.childNodes[0];
    if (!sheet)
        return "";
    var content = "" +
        "if (typeof document != \"undefined\") {\n" +
        // enclose from colliding with other transpiled sheets
        "  (() => {\n" +
        "    const style = document.createElement(\"style\");\n" +
        ("    style.textContent = " + JSON.stringify(paperclip_1.transpileCSSSheet(sheet, function (selectorText, i) {
            var scopedSelectorText = scopeClass ? slim_dom_1.compileScopedCSS(selectorText, scopeClass, aliases) : selectorText;
            return scopedSelectorText;
        })) + "\n\n") +
        "    document.body.appendChild(style);\n" +
        "  })();\n" +
        "}\n\n";
    return content;
};
var conditionMemo = Symbol();
var getConditionTranspileInfo = function (element) {
    if (element[conditionMemo])
        return element[conditionMemo];
    var info = [];
    var i = 0;
    paperclip_1.traversePCAST(element, function (child) {
        if (paperclip_1.isTag(child) && paperclip_1.getPCElementModifier(child, paperclip_1.BKExpressionType.IF)) {
            var modifier = paperclip_1.getPCElementModifier(child, paperclip_1.BKExpressionType.IF).value;
            info.push({
                varName: "conditionPassed_" + (++i),
                modifier: modifier
            });
        }
    });
    return element[conditionMemo] = info;
};
var wrapRenderFunction = function (childContent, childNodes, context, deconstructScopeNames) {
    if (deconstructScopeNames === void 0) { deconstructScopeNames = []; }
    return "(props = {}) => {" + wrapRenderFunctionInner(childContent, childNodes, context, deconstructScopeNames) + "}";
};
var wrapRenderFunctionInner = function (childContent, childNodes, context, deconstructScopeNames) {
    if (deconstructScopeNames === void 0) { deconstructScopeNames = []; }
    var conditionInfo = getConditionTranspileInfo(context.scope);
    var content = "";
    conditionInfo.forEach(function (info) {
        content += "let " + info.varName + ";";
    });
    content +=
        "return " + childContent + ";";
    return content;
};
var transpileNode = function (node, context) {
    switch (node.type) {
        case paperclip_1.PCExpressionType.TEXT_NODE: return transpileTextNode(node);
        case paperclip_1.PCExpressionType.SELF_CLOSING_ELEMENT: return transpileUnslottedElement(node, context);
        case paperclip_1.PCExpressionType.ELEMENT: return transpileUnslottedElement(node, context);
        case paperclip_1.PCExpressionType.BLOCK: return transpileTextBlock(node);
    }
    return "";
};
var transpileTextNode = function (node) {
    var value = node.value;
    if (node.value.trim() === "")
        return null;
    return JSON.stringify(value);
};
var transpileUnslottedElement = function (element, context) {
    return !paperclip_1.hasPCStartTagAttribute(element, "slot") ? transpileModifiedElement(element, context) : null;
};
var transpileModifiedElement = function (element, context) {
    return transpileElementModifiers(element, transpileElement(element, context), context);
};
var transpileElement = function (element, context) {
    var startTag = paperclip_1.getStartTag(element);
    var tagName = startTag.name;
    var componentInfo = context.childComponentInfo[tagName];
    if (tagName === "slot") {
        var slotName = paperclip_1.getPCStartTagAttribute(element, "name");
        return "" + (slotName ? utils_1.getSlotName(slotName) : "children");
    }
    var tagContent;
    if (componentInfo) {
        var childDep = componentInfo;
        var component = utils_1.getComponentFromModule(tagName, childDep.module);
        var componentDepInfo = utils_1.getComponentTranspileInfo(component);
        tagContent = "childComponentClasses." + componentDepInfo.className;
    }
    else {
        tagContent = "\"" + tagName + "\"";
    }
    // TODO - need to check if node is component
    var content = "React.createElement(" + tagContent + ", " + transpileAttributes(element, context, Boolean(componentInfo)) + ", " +
        paperclip_1.getElementChildNodes(element).map(function (node) { return transpileNode(node, context); }).filter(Boolean).join(", ") +
        ")";
    return content;
};
var transpileElementModifiers = function (element, content, context) {
    var startTag = paperclip_1.getStartTag(element);
    var newContent = content;
    var _if;
    var _else;
    var _elseif;
    var _repeat;
    for (var i = 0, length_3 = startTag.modifiers.length; i < length_3; i++) {
        var value = startTag.modifiers[i].value;
        if (value.type == paperclip_1.BKExpressionType.IF) {
            _if = value;
        }
        else if (value.type === paperclip_1.BKExpressionType.ELSEIF) {
            _elseif = value;
        }
        else if (value.type === paperclip_1.BKExpressionType.ELSE) {
            _else = value;
        }
        else if (value.type === paperclip_1.BKExpressionType.REPEAT) {
            _repeat = value;
        }
    }
    if (_repeat) {
        newContent = paperclip_1.transpileBlockExpression(_repeat.each) + ".map((" + paperclip_1.transpileBlockExpression(_repeat.asValue) + ", " + (_repeat.asKey ? paperclip_1.transpileBlockExpression(_repeat.asKey) : "$$i") + ") => {";
        newContent += wrapRenderFunctionInner(content, [element], __assign({}, context, { scope: element }));
        newContent += "})";
        content = newContent;
    }
    if (_if || _elseif || _else) {
        var conditionInfo = getConditionTranspileInfo(context.scope);
        var siblings = paperclip_1.getPCParent(context.scope, element).childNodes;
        var index = siblings.indexOf(element);
        var _mainIf_1;
        for (var i = index + 1; i--;) {
            var sibling = siblings[i];
            if (!paperclip_1.isTag(sibling))
                continue;
            var ifModifierBlock = paperclip_1.getPCElementModifier(sibling, paperclip_1.BKExpressionType.IF);
            if (ifModifierBlock) {
                _mainIf_1 = ifModifierBlock.value;
                break;
            }
        }
        if (!_mainIf_1) {
            throw new Error("Conditional elseif / else specified without a higher [[if]] block");
        }
        var conditionalVarName = conditionInfo.find(function (_a) {
            var modifier = _a.modifier;
            return modifier === _mainIf_1;
        }).varName;
        newContent = "!" + conditionalVarName + " && (" + (_else ? "true" : paperclip_1.transpileBlockExpression((_if || _elseif).condition)) + ") && (" + conditionalVarName + " = true) ? " + content + " : null";
    }
    return newContent;
};
var transpileAttributes = function (element, context, isComponent) {
    var _a = paperclip_1.getStartTag(element), attributes = _a.attributes, modifiers = _a.modifiers;
    var addedScopeStyle = false;
    var content = "{";
    for (var i = 0, length_4 = attributes.length; i < length_4; i++) {
        var attr = attributes[i];
        var name_1 = utils_1.ATTRIBUTE_MAP[attr.name.toLocaleLowerCase()] || attr.name;
        var value = attr.value ? transpileAttributeValue(attr.value) : "true";
        // skip slots
        if (name_1 === "slot") {
            continue;
        }
        if (name_1 === "className") {
            if (!isComponent) {
                value = "\"" + context.scopeClass + " \" + " + value;
                addedScopeStyle = true;
            }
        }
        content += "\"" + name_1 + "\": " + value + ",";
    }
    if (!addedScopeStyle) {
        content += "\"className\": \"" + context.scopeClass + "\",";
    }
    // check immediate children for slots (slots cannot be nested), and add
    // those slots as attributes to this element.
    if (element.type === paperclip_1.PCExpressionType.ELEMENT) {
        var slottedElements = element.childNodes.filter(function (child) { return paperclip_1.isTag(child) && paperclip_1.hasPCStartTagAttribute(child, "slot"); });
        slottedElements.forEach(function (element) {
            content += "\"" + utils_1.getSlotName(paperclip_1.getPCStartTagAttribute(element, "slot")) + "\": " + transpileModifiedElement(element, context) + ",";
        });
    }
    content += "}";
    // check for spreads
    for (var i = 0, length_5 = modifiers.length; i < length_5; i++) {
        var modifier = modifiers[i];
        if (modifier.value.type === paperclip_1.BKExpressionType.BIND) {
            content = "Object.assign(" + content + ", " + paperclip_1.transpileBlockExpression(modifier.value.value) + ")";
        }
    }
    return content;
};
var transpileAttributeValue = function (value) {
    if (value.type === paperclip_1.PCExpressionType.STRING_BLOCK) {
        return "(" + value.values.map(transpileAttributeValue).join(" + ") + ")";
    }
    else if (value.type === paperclip_1.PCExpressionType.STRING) {
        return JSON.stringify(value.value);
    }
    else if (value.type === paperclip_1.PCExpressionType.BLOCK) {
        return "(" + paperclip_1.transpileBlockExpression(value.value.value) + ")";
    }
    throw new Error("Cannot transpile attribute value type " + value.type);
};
var transpileTextBlock = function (node) {
    return paperclip_1.transpileBlockExpression(node.value.value);
};
//# sourceMappingURL=module.js.map