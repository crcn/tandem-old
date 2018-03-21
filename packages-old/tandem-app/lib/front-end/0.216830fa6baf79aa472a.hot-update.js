webpackHotUpdate(0,{

/***/ "../paperclip/lib/loader.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO - assert modifiers (cannot have else, elseif, and else in the same block)
// TODO - throw error if var found out of context
Object.defineProperty(exports, "__esModule", { value: true });
var ast_1 = __webpack_require__("../paperclip/lib/ast.js");
var parser_1 = __webpack_require__("../paperclip/lib/parser.js");
var LOADED_SYMBOL = Symbol();
exports.loadModuleAST = function (ast, uri) {
    // weak memoization
    if (ast[LOADED_SYMBOL] && ast[LOADED_SYMBOL][0] === ast)
        return ast[LOADED_SYMBOL][1];
    var module = createModule(ast, uri);
    ast[LOADED_SYMBOL] = [ast, module];
    return module;
};
exports.defaultResolveModulePath = function (relative, base) {
    var dirname = base.split("/");
    dirname.pop();
    relative = relative.replace("./", "");
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
        var module_1 = graph[filePath].module;
        for (var _i = 0, _a = module_1.components; _i < _a.length; _i++) {
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
    module.components.forEach(function (component) {
        Object.assign(info, exports.getChildComponentInfo(component.template, graph));
    });
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
        for (var i = 0, length_1 = dep.module.components.length; i < length_1; i++) {
            var component = dep.module.components[i];
            if (component.id === id) {
                return dep;
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
        if (!module.imports.length) {
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
                imports.push(createImport(attributes));
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
        components: components,
        globalStyles: globalStyles,
        unhandledExpressions: unhandledExpressions,
    };
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
    for (var i = 0, length_3 = attributes.length; i < length_3; i++) {
        var attr = attributes[i];
        if (attr.name === "id") {
            id = ast_1.getAttributeStringValue(attr);
        }
    }
    for (var i = 0, length_4 = childNodes.length; i < length_4; i++) {
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
                    previews.push(element_1);
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
var createImport = function (attributes) {
    var href;
    var type;
    for (var i = 0, length_5 = attributes.length; i < length_5; i++) {
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

/***/ })

})