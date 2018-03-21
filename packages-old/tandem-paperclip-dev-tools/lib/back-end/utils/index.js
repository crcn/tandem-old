"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var glob = require("glob");
var path = require("path");
var minimatch = require("minimatch");
var md5 = require("md5");
var fs = require("fs");
var fsa = require("fs-extra");
var aerial_common2_1 = require("aerial-common2");
var paperclip_1 = require("paperclip");
var ComponentMetadataName;
(function (ComponentMetadataName) {
    ComponentMetadataName["PREVIEW"] = "preview";
    ComponentMetadataName["INTERNAL"] = "internal";
})(ComponentMetadataName || (ComponentMetadataName = {}));
;
// TODO - will eventually want to use app state to check extension
exports.isPaperclipFile = function (filePath, state) { return exports.getModulesFileTester(state)(filePath); };
exports.getModulesFilePattern = function (_a) {
    var _b = _a.options, cwd = _b.cwd, sourceFilePattern = _b.projectConfig.sourceFilePattern;
    return path.join(cwd, sourceFilePattern);
};
exports.getModulesFileTester = function (state) {
    return function (filePath) { return /\.pc$/.test(filePath); };
};
exports.getModuleFilePaths = function (state) { return glob.sync(exports.getModulesFilePattern(state)); };
exports.getModuleSourceDirectory = function (state) {
    if (state.fileCache.length) {
        var pcFileCacheItem = state.fileCache.find(function (item) { return (minimatch(state.options.projectConfig.sourceFilePattern, item.filePath)); });
        if (pcFileCacheItem) {
            return path.dirname(pcFileCacheItem.filePath);
        }
    }
    var sourceFiles = exports.getModuleFilePaths(state);
    if (!sourceFiles.length) {
        if (minimatch(state.options.projectConfig.sourceFilePattern, constants_1.DEFAULT_COMPONENT_SOURCE_DIRECTORY)) {
            return path.join(state.options.cwd, constants_1.DEFAULT_COMPONENT_SOURCE_DIRECTORY);
        }
        else {
            // scan for ALL files and directories if source directory does not match
            var allFiles = glob.sync(state.options.projectConfig.sourceFilePattern.replace(/\.*\w+$/, ""));
            for (var _i = 0, allFiles_1 = allFiles; _i < allFiles_1.length; _i++) {
                var file = allFiles_1[_i];
                if (fs.lstatSync(file).isDirectory()) {
                    return file;
                }
            }
        }
    }
    return path.dirname(sourceFiles[0]);
};
// side effect code - use in sagas
exports.getReadFile = aerial_common2_1.weakMemo(function (state) { return function (filePath) {
    var fileCache = state.fileCache.find(function (item) { return item.filePath === filePath; });
    return fileCache ? fileCache.content.toString("utf8") : fs.readFileSync(filePath, "utf8");
}; });
exports.getAllModules = function (state) {
    var moduleFilePaths = exports.getModuleFilePaths(state);
    var read = exports.getReadFile(state);
    return moduleFilePaths.map(function (filePath) {
        var result = paperclip_1.parseModuleSource(read(filePath));
        if (!result.root) {
            return;
        }
        var module = paperclip_1.loadModuleAST(result.root, filePath);
        return module;
    }).filter(Boolean);
};
exports.getAllModuleComponents = function (state) {
    var components = [];
    for (var _i = 0, _a = exports.getAllModules(state); _i < _a.length; _i++) {
        var module_1 = _a[_i];
        if (module_1.type === paperclip_1.PCModuleType.COMPONENT) {
            components.push.apply(components, module_1.components);
        }
    }
    return components;
};
exports.getAssocComponents = function (matchFilePath, state) { return __awaiter(_this, void 0, void 0, function () {
    var allFilePaths, assocComponents, _i, allFilePaths_1, moduleFilePath, graph, result, entry, childComponentInfo, tagName, dep, importedDependencies, _a, importedDependencies_1, globalDep, _b, _c, component;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                allFilePaths = exports.getModuleFilePaths(state);
                assocComponents = {};
                _i = 0, allFilePaths_1 = allFilePaths;
                _d.label = 1;
            case 1:
                if (!(_i < allFilePaths_1.length)) return [3 /*break*/, 5];
                moduleFilePath = allFilePaths_1[_i];
                graph = state.graph;
                if (!!graph) return [3 /*break*/, 3];
                return [4 /*yield*/, paperclip_1.loadModuleDependencyGraph(moduleFilePath, {
                        readFile: exports.getReadFile(state)
                    })];
            case 2:
                result = _d.sent();
                graph = result.graph;
                _d.label = 3;
            case 3:
                entry = graph[moduleFilePath];
                childComponentInfo = paperclip_1.getDependencyChildComponentInfo(entry, graph);
                for (tagName in childComponentInfo) {
                    dep = childComponentInfo[tagName];
                    if (dep.module.uri === matchFilePath) {
                        assocComponents[tagName] = entry;
                    }
                }
                // no affected components, check import match. If there's a match, then
                // return all components. (imports may affect child components -- e.g: if there's a global style defined)
                if (!assocComponents.length) {
                    importedDependencies = paperclip_1.getImportDependencies(entry, graph);
                    for (_a = 0, importedDependencies_1 = importedDependencies; _a < importedDependencies_1.length; _a++) {
                        globalDep = importedDependencies_1[_a];
                        if (globalDep.module.uri === matchFilePath && entry.module.type === paperclip_1.PCModuleType.COMPONENT) {
                            for (_b = 0, _c = entry.module.components; _b < _c.length; _b++) {
                                component = _c[_b];
                                assocComponents[component.id] = entry;
                            }
                            break;
                        }
                    }
                }
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/, assocComponents];
        }
    });
}); };
exports.getModuleId = function (filePath) { return md5(filePath); };
exports.getPublicFilePath = function (filePath, state) {
    var sourceDirectory = exports.getModuleSourceDirectory(state);
    if (filePath.indexOf(sourceDirectory) === 0) {
        return filePath.replace(sourceDirectory, constants_1.PUBLIC_SRC_DIR_PATH);
    }
    return null;
};
exports.getComponentPreviewUrl = function (componentId, state) { return "http://localhost:" + state.options.port + "/components/" + componentId + "/preview"; };
exports.getAvailableComponents = function (state, readFileSync) {
    return exports.getModuleFilePaths(state).reduce(function (components, filePath) { return (components.concat(exports.getComponentsFromSourceContent(readFileSync(filePath), filePath, state))); }, []);
};
exports.getPreviewClippingNamespace = function (componentId, previewName) { return componentId + "." + previewName; };
exports.getComponentsFromSourceContent = function (content, filePath, state) {
    var moduleId = exports.getModuleId(filePath);
    var result = paperclip_1.parseModuleSource(content);
    if (!result.root) {
        console.warn("Syntax error in " + filePath);
        result.diagnostics.forEach(function (diagnostic) {
            console.log(diagnostic.message);
        });
        return [];
    }
    var module = paperclip_1.loadModuleAST(result.root, filePath);
    if (module.type !== paperclip_1.PCModuleType.COMPONENT) {
        return [];
    }
    return module.components.filter(function (component) { return !paperclip_1.getComponentMetadataItem(component, ComponentMetadataName.INTERNAL); }).map(function (_a) {
        var id = _a.id, source = _a.source, previews = _a.previews;
        return ({
            filePath: filePath,
            label: id,
            location: source.location,
            $id: id,
            screenshots: previews.map(function (preview) {
                return exports.getComponentScreenshot(id, preview.name, state);
            }),
            tagName: id,
            moduleId: moduleId,
        });
    });
};
exports.getComponentScreenshot = function (componentId, previewName, state) {
    var ss = state.componentScreenshots[state.componentScreenshots.length - 1];
    var clippingNamespace = exports.getPreviewClippingNamespace(componentId, previewName);
    return ss && ss.clippings[clippingNamespace] && {
        previewName: previewName,
        uri: "http://localhost:" + state.options.port + "/screenshots/" + md5(state.componentScreenshots[state.componentScreenshots.length - 1].uri),
        clip: ss.clippings[clippingNamespace]
    };
};
exports.getAllComponentsPreviewUrl = function (state) {
    return "http://localhost:" + state.options.port + "/components/all/preview";
};
exports.getPreviewComponentEntries = function (state) {
    var allModules = exports.getAllModules(state);
    var entries = [];
    var currentTop = 0;
    for (var _i = 0, allModules_1 = allModules; _i < allModules_1.length; _i++) {
        var module_2 = allModules_1[_i];
        if (module_2.type !== paperclip_1.PCModuleType.COMPONENT) {
            continue;
        }
        for (var _a = 0, _b = module_2.components; _a < _b.length; _a++) {
            var component = _b[_a];
            // TODO - check for preview meta
            for (var i = 0, length_1 = component.previews.length; i < length_1; i++) {
                var preview = component.previews[i];
                var width = Number(paperclip_1.getPCStartTagAttribute(preview.source, "width") || constants_1.DEFAULT_COMPONENT_PREVIEW_SIZE.width);
                var height = Number(paperclip_1.getPCStartTagAttribute(preview.source, "height") || constants_1.DEFAULT_COMPONENT_PREVIEW_SIZE.height);
                var bounds = { left: 0, top: currentTop, right: width, bottom: currentTop + height };
                entries.push({
                    bounds: bounds,
                    componentId: component.id,
                    previewName: preview.name || String(i),
                    relativeFilePath: exports.getPublicSrcPath(module_2.uri, state)
                });
                currentTop = bounds.bottom;
            }
        }
    }
    return entries;
};
exports.getPublicSrcPath = function (filePath, state) {
    return exports.getPublicFilePath(filePath, state);
};
var getStorageFilePath = function (workspaceId, state) {
    return path.join(constants_1.TMP_DIRECTORY, "storage", workspaceId + ".json");
};
exports.getStorageData = function (key, state) {
    var filePath = getStorageFilePath(key, state);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    return null;
};
exports.setStorageData = function (key, data, state) {
    var filePath = getStorageFilePath(key, state);
    if (!fs.existsSync(filePath)) {
        try {
            fsa.mkdirpSync(path.dirname(filePath));
        }
        catch (e) {
        }
    }
    fs.writeFileSync(filePath, JSON.stringify(data));
};
//# sourceMappingURL=index.js.map