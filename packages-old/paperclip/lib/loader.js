"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast_1 = require("./ast");
var utils_1 = require("./utils");
var parser_1 = require("./parser");
var constants_1 = require("./constants");
var PCModuleType;
(function (PCModuleType) {
    PCModuleType[PCModuleType["COMPONENT"] = 0] = "COMPONENT";
    PCModuleType[PCModuleType["CSS"] = 1] = "CSS";
})(PCModuleType = exports.PCModuleType || (exports.PCModuleType = {}));
;
var LOADED_SYMBOL = Symbol();
exports.loadModuleAST = function (ast, uri) {
    // weak memoization
    if (ast[LOADED_SYMBOL] && ast[LOADED_SYMBOL][0] === ast)
        return ast[LOADED_SYMBOL][1];
    var module = createModule(ast, uri);
    ast[LOADED_SYMBOL] = [ast, module];
    return module;
};
exports.getAllComponents = utils_1.weakMemo(function (graph) {
    var allComponents = {};
    for (var filePath in graph) {
        var module = graph[filePath].module;
        if (module.type === PCModuleType.COMPONENT) {
            for (var _i = 0, _a = module.components; _i < _a.length; _i++) {
                var component = _a[_i];
                allComponents[component.id] = component;
            }
        }
    }
    return allComponents;
});
exports.getComponentSourceUris = utils_1.weakMemo(function (graph) {
    var componentUris = {};
    for (var filePath in graph) {
        var module = graph[filePath].module;
        if (module.type === PCModuleType.COMPONENT) {
            for (var _i = 0, _a = module.components; _i < _a.length; _i++) {
                var component = _a[_i];
                componentUris[component.id] = filePath;
            }
        }
    }
    return componentUris;
});
exports.defaultResolveModulePath = function (relative, base) {
    var dirname = base.split("/");
    dirname.pop();
    relative = relative.replace(/^\.\//, "");
    var parentDirs = relative.split("../");
    var baseName = parentDirs.pop();
    dirname.splice(dirname.length - parentDirs.length, dirname.length);
    return dirname.join("/") + "/" + baseName;
};
exports.getChildComponentInfo = function (root, graph) {
    var info = {};
    ast_1.getAllChildElementNames(root).forEach(function (tagName) {
        var dependency = exports.getComponentDependency(tagName, graph);
        if (dependency) {
            info[tagName] = dependency;
        }
    });
    return info;
};
exports.getDependencyGraphComponentsExpressions = function (graph) {
    var templates = {};
    for (var filePath in graph) {
        var module = graph[filePath].module;
        for (var _i = 0, _a = module.components; _i < _a.length; _i++) {
            var component = _a[_i];
            templates[component.id] = {
                filePath: filePath,
                expression: component.source
            };
        }
    }
    return templates;
};
exports.getDependencyChildComponentInfo = function (_a, graph) {
    var module = _a.module;
    var info = {};
    if (module.type === PCModuleType.COMPONENT) {
        module.components.forEach(function (component) {
            Object.assign(info, exports.getChildComponentInfo(component.template, graph));
        });
    }
    return info;
};
exports.getModuleComponent = function (id, module) { return module.components.find(function (component) { return component.id === id; }); };
exports.getUsedDependencies = function (dep, graph) {
    var allDeps = [];
    var info = exports.getDependencyChildComponentInfo(dep, graph);
    var componentTagGraph = exports.getDependencyChildComponentInfo(dep, graph);
    for (var tagName in componentTagGraph) {
        var dep_1 = componentTagGraph[tagName];
        if (allDeps.indexOf(dep_1) === -1) {
            allDeps.push(dep_1);
        }
    }
    return allDeps;
};
exports.getImportDependencies = function (_a, graph) {
    var resolvedImportUris = _a.resolvedImportUris;
    var importDeps = [];
    for (var relativePath in resolvedImportUris) {
        importDeps.push(graph[resolvedImportUris[relativePath]]);
    }
    return importDeps;
};
exports.getComponentDependency = function (id, graph) {
    for (var uri in graph) {
        var dep = graph[uri];
        if (dep.module.type === PCModuleType.COMPONENT) {
            var module = dep.module;
            for (var i = 0, length_1 = module.components.length; i < length_1; i++) {
                var component = module.components[i];
                if (component.id === id) {
                    return dep;
                }
            }
        }
    }
};
exports.loadModuleDependencyGraph = function (uri, _a, graph, diagnostics) {
    var readFile = _a.readFile, _b = _a.resolveFile, resolveFile = _b === void 0 ? exports.defaultResolveModulePath : _b;
    if (graph === void 0) { graph = {}; }
    if (diagnostics === void 0) { diagnostics = []; }
    // beat circular dep
    if (graph[uri]) {
        return Promise.resolve({ diagnostics: diagnostics, graph: graph });
    }
    return Promise.resolve(readFile(uri))
        .then(function (source) { return parser_1.parseModuleSource(source, uri); })
        .then(function (result) {
        diagnostics.push.apply(diagnostics, result.diagnostics);
        if (!result.root) {
            return null;
        }
        return exports.loadModuleAST(result.root, uri);
    })
        .then(function (module) {
        if (!module) {
            return null;
        }
        var resolvedImportUris = {};
        // set DG value to prevent getting caught in a loop via
        // circ dependencies
        graph[uri] = { module: module, resolvedImportUris: resolvedImportUris };
        if (module.type !== PCModuleType.COMPONENT || !module.imports.length) {
            return Promise.resolve(graph);
        }
        return Promise.all(module.imports.map(function (_import) {
            return Promise.resolve(resolveFile(_import.href, uri))
                .then(function (resolvedUri) {
                resolvedImportUris[_import.href] = resolvedUri;
                return exports.loadModuleDependencyGraph(resolvedUri, { readFile: readFile, resolveFile: resolveFile }, graph, diagnostics);
            });
        }));
    })
        .then(function () {
        return { graph: graph, diagnostics: diagnostics };
    });
};
var createModule = function (ast, uri) {
    var childNodes = ast.type === ast_1.PCExpressionType.FRAGMENT ? ast.childNodes : [ast];
    var imports = [];
    var components = [];
    var globalStyles = [];
    var unhandledExpressions = [];
    addImports(ast, imports);
    if (utils_1.isPaperclipFile(uri)) {
        for (var i = 0, length_2 = childNodes.length; i < length_2; i++) {
            var child = childNodes[i];
            if (child.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT || child.type === ast_1.PCExpressionType.ELEMENT) {
                var element = child;
                var tagName = ast_1.getElementTagName(element);
                var childNodes_1 = ast_1.getElementChildNodes(element);
                var attributes = ast_1.getElementAttributes(element);
                var modifiers = ast_1.getElementModifiers(element);
                if (tagName === "component" && element.type === ast_1.PCExpressionType.ELEMENT) {
                    components.push(createComponent(element, modifiers, attributes, childNodes_1));
                    continue;
                }
                else if (tagName === "link") {
                    // imports.push(createImport(attributes));
                    continue;
                }
                else if (tagName === "style") {
                    globalStyles.push(element);
                    continue;
                }
            }
            unhandledExpressions.push(child);
        }
        return {
            source: ast,
            uri: uri,
            imports: imports,
            type: PCModuleType.COMPONENT,
            components: components,
            globalStyles: globalStyles,
            unhandledExpressions: unhandledExpressions,
        };
    }
    else if (utils_1.isCSSFile(uri)) {
        return {
            source: ast,
            type: PCModuleType.CSS,
            uri: uri,
        };
    }
};
var addImports = function (current, imports) {
    switch (current.type) {
        case ast_1.PCExpressionType.SELF_CLOSING_ELEMENT:
        case ast_1.PCExpressionType.ELEMENT: {
            var childNodes = void 0;
            var startTag = void 0;
            if (current.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT) {
                startTag = ast_1.getStartTag(current);
                childNodes = [];
            }
            else {
                var el = current;
                startTag = el.startTag;
                childNodes = el.childNodes;
            }
            if (startTag.name === "link") {
                imports.push(createImport(startTag.attributes));
            }
            for (var i = 0, length_3 = childNodes.length; i < length_3; i++) {
                addImports(childNodes[i], imports);
            }
            break;
        }
        case ast_1.PCExpressionType.FRAGMENT: {
            var childNodes = current.childNodes;
            for (var i = 0, length_4 = childNodes.length; i < length_4; i++) {
                addImports(childNodes[i], imports);
            }
            break;
        }
        case ast_1.CSSExpressionType.SHEET: {
            var children = current.children;
            for (var i = 0, length_5 = children.length; i < length_5; i++) {
                addCSSImports(children[i], imports);
            }
            break;
        }
    }
};
var addCSSImports = function (current, imports) {
    switch (current.type) {
        case ast_1.CSSExpressionType.AT_RULE: {
            var _a = current, name_1 = _a.name, params = _a.params, children = _a.children;
            if (name_1 === "import") {
                imports.push({
                    href: params.join(" "),
                    type: "stylesheet"
                });
            }
            break;
        }
    }
};
exports.parseMetaContent = function (content) {
    var params = {};
    for (var _i = 0, _a = content.split(/,\s+/g); _i < _a.length; _i++) {
        var part = _a[_i];
        var _b = part.split("="), key = _b[0], value = _b[1];
        params[key] = value;
    }
    return params;
};
exports.getComponentMetadataItems = function (component, name) { return component.metadata.filter(function (meta) { return meta.name === name; }); };
exports.getComponentMetadataItem = function (component, name) { return exports.getComponentMetadataItems(component, name).shift(); };
var createComponent = function (element, modifiers, attributes, childNodes) {
    var id;
    var style;
    var template;
    var previews = [];
    var metadata = [];
    for (var i = 0, length_6 = attributes.length; i < length_6; i++) {
        var attr = attributes[i];
        if (attr.name === "id") {
            id = ast_1.getAttributeStringValue(attr);
        }
    }
    for (var i = 0, length_7 = childNodes.length; i < length_7; i++) {
        var child = childNodes[i];
        if (child.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT || child.type === ast_1.PCExpressionType.ELEMENT) {
            var element_1 = child;
            var tagName = ast_1.getElementTagName(element_1);
            var attributes_1 = ast_1.getElementAttributes(element_1);
            var childNodes_2 = ast_1.getElementChildNodes(element_1);
            if (tagName === "style") {
                style = element_1;
            }
            else if (tagName === "template") {
                template = element_1;
            }
            else if (tagName === "preview") {
                if (child.type === ast_1.PCExpressionType.ELEMENT && child.childNodes.find(function (child) { return child.type === ast_1.PCExpressionType.ELEMENT || child.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT; }) && Boolean(ast_1.getPCStartTagAttribute(element_1, "name"))) {
                    previews.push({
                        source: element_1,
                        name: ast_1.getPCStartTagAttribute(element_1, "name"),
                        width: Number(ast_1.getPCStartTagAttribute(element_1, "width") || constants_1.DEFAULT_PREVIEW_SIZE.width),
                        height: Number(ast_1.getPCStartTagAttribute(element_1, "height") || constants_1.DEFAULT_PREVIEW_SIZE.height)
                    });
                }
            }
            else if (tagName === "meta") {
                metadata.push({
                    name: ast_1.getPCStartTagAttribute(element_1, "name"),
                    params: exports.parseMetaContent(ast_1.getPCStartTagAttribute(element_1, "content") || "")
                });
            }
        }
    }
    return {
        source: element,
        id: id,
        style: style,
        metadata: metadata,
        template: template,
        previews: previews
    };
};
exports.getComponentPreview = function (name, component) {
    return component.previews.find(function (preview) { return preview.name === name; });
};
var createImport = function (attributes) {
    var href;
    var type;
    for (var i = 0, length_8 = attributes.length; i < length_8; i++) {
        var attr = attributes[i];
        if (attr.name === "href") {
            href = ast_1.getAttributeStringValue(attr);
        }
        else if (attr.name === "type") {
            type = ast_1.getAttributeStringValue(attr);
        }
    }
    return {
        type: type,
        href: href,
    };
};
//# sourceMappingURL=loader.js.map