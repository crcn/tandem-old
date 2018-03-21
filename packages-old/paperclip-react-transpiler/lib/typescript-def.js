"use strict";
/*

TODOS:

- [ ] transpile component prop types
- [ ] type-loader
*/
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var path = require("path");
var paperclip_1 = require("paperclip");
var utils_1 = require("./utils");
exports.transpileToTypeScriptDefinition = function (graph, uri) {
    return transpileModule(graph[uri], graph);
};
var transpileModule = function (entry, graph) {
    var content = "";
    var module = entry.module;
    var baseName = getImportBaseName(module.uri);
    var allDeps = paperclip_1.getUsedDependencies(entry, graph);
    var importTranspileInfo = utils_1.getImportsInfo(entry, allDeps);
    content += "import * as React from \"react\";\n";
    importTranspileInfo.forEach(function (_a) {
        var varName = _a.varName, relativePath = _a.relativePath;
        content += "import * as " + varName + " from \"" + relativePath + "\";\n";
    });
    content += "\n";
    content += "type Enhancer<TInner, TOuter> = (BaseComponent: React.ComponentClass<TInner>) => React.ComponentClass<TOuter>;\n\n";
    var componentTranspileInfo = module.components.map(utils_1.getComponentTranspileInfo);
    componentTranspileInfo.forEach(function (info) {
        content += transpileComponentTypedInformation(info, importTranspileInfo, graph);
    });
    return content;
};
var getImportBaseName = function (href) { return lodash_1.upperFirst(lodash_1.camelCase(path.basename(href).split(".").shift())); };
var transpileComponentTypedInformation = function (_a, importTranspileInfo, graph) {
    var className = _a.className, component = _a.component, propTypesName = _a.propTypesName, enhancerName = _a.enhancerName;
    var content = "";
    var classPropsName = propTypesName;
    var inference = paperclip_1.inferNodeProps(component.source).inference;
    content += "" +
        ("type " + classPropsName + "SlotProps = {") +
        ("" + utils_1.getTemplateSlotNames(component.template).map(function (slotName) { return ("  " + slotName + ": any;\n"); }).join("")) +
        "};\n\n";
    content += "" +
        ("export type " + classPropsName + " = " + transpileInferredProps(inference) + " & " + classPropsName + "SlotProps;\n\n");
    var childComponentDependencies = paperclip_1.getChildComponentInfo(component.template, graph);
    var propTypeMap = {};
    for (var childComponentTagName in childComponentDependencies) {
        var componentElements = paperclip_1.getPCASTElementsByTagName(component.template, childComponentTagName);
        var childComponentDependency = childComponentDependencies[childComponentTagName];
        var childComponent = utils_1.getComponentFromModule(childComponentTagName, childComponentDependency.module);
        var childComponentInfo = utils_1.getComponentTranspileInfo(childComponent);
        var childImport = utils_1.getImportFromDependency(importTranspileInfo, childComponentDependency);
        var propsRef = childImport ? childImport.varName + "." + childComponentInfo.propTypesName : "" + childComponentInfo.propTypesName;
        var allEntries = [];
        var childPropTypes = "{\n";
        var usedAttributes = {};
        var addedBind = false;
        for (var _i = 0, componentElements_1 = componentElements; _i < componentElements_1.length; _i++) {
            var element = componentElements_1[_i];
            var attrs = paperclip_1.getElementAttributes(element);
            for (var _b = 0, attrs_1 = attrs; _b < attrs_1.length; _b++) {
                var attr = attrs_1[_b];
                if (attr.name === "key" || usedAttributes[attr.name]) {
                    continue;
                }
                usedAttributes[attr.name] = true;
                // TODO - get inference types based on value
                childPropTypes += (utils_1.ATTRIBUTE_MAP[attr.name] || attr.name) + ": any;\n";
            }
            if (!addedBind && paperclip_1.getPCElementModifier(element, paperclip_1.BKExpressionType.BIND)) {
                addedBind = true;
                childPropTypes += "[identifier: string]: any;\n";
            }
        }
        childPropTypes += "}";
        var childTypeName = className + "Child" + childComponentInfo.propTypesName;
        propTypeMap[childComponentInfo.className] = childTypeName;
        content += "type " + childTypeName + " = " + childPropTypes + ";\n\n";
        childComponentInfo.propTypesName;
    }
    var childComponentGettersTypeName = className + "ChildComponentClasses";
    content += "type " + childComponentGettersTypeName + " = {\n";
    for (var childComponentClassName in propTypeMap) {
        var propTypesName_1 = propTypeMap[childComponentClassName];
        content += "  " + childComponentClassName + ": React.StatelessComponent<" + propTypesName_1 + "> | React.ComponentClass<" + propTypesName_1 + ">;\n";
    }
    content += "};\n\n";
    // _all_ component classes here are required to notify engineers of any changes to PC components. This only
    // happens when the typed definition file is regenerated. Internally, Paperclip doesn't care if child components are provides, and will provide the default "dumb" version of components.
    content += "export function hydrate" + className + "<TInner extends " + propTypesName + ", TOuter>(enhancer: Enhancer<TInner, TOuter>, childComponentClasses: " + childComponentGettersTypeName + "): React.ComponentClass<TOuter>;\n\n";
    return content;
};
var transpileInferredProps = function (_a, path) {
    var type = _a.type, properties = _a.properties;
    if (path === void 0) { path = []; }
    if (type === paperclip_1.InferenceType.ANY) {
        return "any";
    }
    else if (properties.$$each) {
        var content = transpileInferredProps(properties.$$each, path.concat(["$$each"]));
        var buffer = [];
        if (type & paperclip_1.InferenceType.ARRAY) {
            buffer.push("Array<" + content + ">");
        }
        if (type & paperclip_1.InferenceType.OBJECT) {
            buffer.push("{ [identifier: string]:" + content + " }");
        }
        return buffer.join(" | ");
    }
    else if (type & paperclip_1.InferenceType.OBJECT) {
        var content = "{\n";
        for (var key in properties) {
            content += lodash_1.repeat(" ", path.length * 2) + ((utils_1.ATTRIBUTE_MAP[key] || key) + ": " + transpileInferredProps(properties[key], path.concat([key])) + ";\n");
        }
        // allow for any props for now. Will eventuall want to request for template 
        content += lodash_1.repeat(" ", (path.length) * 2) + "[identifier: string]: any;\n";
        content += lodash_1.repeat(" ", (path.length - 1) * 2) + "}";
        return content;
    }
    else {
        var content = "";
        var buffer = [];
        if (type & paperclip_1.InferenceType.STRING) {
            buffer.push("string");
        }
        if (type & paperclip_1.InferenceType.NUMBER) {
            buffer.push("number");
        }
        if (type & paperclip_1.InferenceType.BOOLEAN) {
            buffer.push("boolean");
        }
        return buffer.join(" | ");
    }
};
//# sourceMappingURL=typescript-def.js.map