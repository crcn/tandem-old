"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var effects_1 = require("redux-saga/effects");
var redux_saga_1 = require("redux-saga");
var utils_1 = require("../utils");
var constants_1 = require("../constants");
var slim_dom_1 = require("slim-dom");
var state_1 = require("../state");
var actions_1 = require("../actions");
var paperclip_1 = require("paperclip");
var source_mutation_1 = require("source-mutation");
var lodash_1 = require("lodash");
var chokidar = require("chokidar");
var fs = require("fs");
var glob = require("glob");
function uriWatcherSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleWatchUrisRequest)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleDependencyGraph)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.uriWatcherSaga = uriWatcherSaga;
function handleWatchUrisRequest() {
    var child, chan, prevWatchUris, _loop_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.take(actions_1.INIT_SERVER_REQUESTED)];
            case 1:
                _a.sent();
                prevWatchUris = [];
                _loop_1 = function () {
                    var state, _a, watchUris, fileCache, diffs, updates, componentFileTester, urisByFilePath, allUris, readFile, initialFileCache, filesByUri;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, effects_1.select()];
                            case 1:
                                state = _b.sent();
                                _a = state.watchUris, watchUris = _a === void 0 ? [] : _a, fileCache = state.fileCache;
                                diffs = source_mutation_1.diffArray(watchUris, prevWatchUris, function (a, b) { return a === b ? 0 : -1; });
                                updates = diffs.mutations.filter(function (mutation) { return mutation.type === source_mutation_1.ARRAY_UPDATE; });
                                if (prevWatchUris.length && updates.length === diffs.mutations.length) {
                                    console.log("no change");
                                    return [2 /*return*/, "continue"];
                                }
                                prevWatchUris = watchUris;
                                componentFileTester = utils_1.getModulesFileTester(state);
                                urisByFilePath = watchUris.filter((function (uri) { return uri.substr(0, 5) === "file:"; })).map(function (uri) { return (uri.replace("file://", "")); }).filter(function (filePath) { return !componentFileTester(filePath); });
                                allUris = [
                                    utils_1.getModulesFilePattern(state)
                                ].concat(urisByFilePath);
                                console.log("watching: ", allUris);
                                if (child) {
                                    chan.close();
                                    effects_1.cancel(child);
                                }
                                readFile = function (filePath) {
                                    return ({
                                        filePath: filePath,
                                        a: Math.random(),
                                        content: new Buffer(fs.readFileSync(filePath, "utf8")),
                                        mtime: fs.lstatSync(filePath).mtime
                                    });
                                };
                                initialFileCache = glob.sync(utils_1.getModulesFilePattern(state)).map(function (filePath) { return (fileCache.find(function (item) { return item.filePath === filePath; }) || readFile(filePath)); });
                                return [4 /*yield*/, redux_saga_1.eventChannel(function (emit) {
                                        var watcher = chokidar.watch(allUris);
                                        watcher.on("ready", function () {
                                            var emitChange = function (path) {
                                                var mtime = fs.lstatSync(path).mtime;
                                                var fileCacheItem = initialFileCache.find(function (item) { return item.filePath === path; });
                                                if (fileCacheItem && fileCacheItem.mtime === mtime) {
                                                    return;
                                                }
                                                var newContent = fs.readFileSync(path, "utf8");
                                                var publicPath = utils_1.getPublicFilePath(path, state);
                                                // for internal -- do not want this being sent over the network since it is slow
                                                emit(actions_1.fileContentChanged(path, publicPath, newContent, mtime));
                                            };
                                            watcher.on("add", emitChange);
                                            watcher.on("change", emitChange);
                                            watcher.on("unlink", function (path) {
                                                emit(actions_1.fileRemoved(path, utils_1.getPublicFilePath(path, state)));
                                            });
                                        });
                                        return function () {
                                            watcher.close();
                                        };
                                    })];
                            case 2:
                                chan = _b.sent();
                                filesByUri = fileCache.map(function (item) { return item.filePath; });
                                return [4 /*yield*/, effects_1.put(actions_1.watchingFiles(initialFileCache))];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, effects_1.spawn(function () {
                                        var c, e_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!1) return [3 /*break*/, 6];
                                                    return [4 /*yield*/, effects_1.take(chan)];
                                                case 1:
                                                    c = _a.sent();
                                                    _a.label = 2;
                                                case 2:
                                                    _a.trys.push([2, 4, , 5]);
                                                    return [4 /*yield*/, effects_1.put(c)];
                                                case 3:
                                                    _a.sent();
                                                    return [3 /*break*/, 5];
                                                case 4:
                                                    e_1 = _a.sent();
                                                    console.warn("warn ", e_1);
                                                    return [3 /*break*/, 5];
                                                case 5: return [3 /*break*/, 0];
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    })];
                            case 4:
                                child = _b.sent();
                                return [4 /*yield*/, effects_1.take(actions_1.WATCH_URIS_REQUESTED)];
                            case 5:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 2;
            case 2:
                if (!true) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_1()];
            case 3:
                _a.sent();
                return [3 /*break*/, 2];
            case 4: return [2 /*return*/];
        }
    });
}
function handleDependencyGraph() {
    var action, state, graph, _i, _a, fileCacheItem, _b, diagnostics, newGraph;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!true) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.take([actions_1.WATCHING_FILES, actions_1.FILE_CONTENT_CHANGED, actions_1.FILE_REMOVED])];
            case 1:
                action = _c.sent();
                console.log("loading dependency graph");
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _c.sent();
                graph = {};
                _i = 0, _a = state.fileCache;
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                fileCacheItem = _a[_i];
                if (!utils_1.isPaperclipFile(fileCacheItem.filePath, state)) {
                    return [3 /*break*/, 5];
                }
                return [4 /*yield*/, effects_1.call(paperclip_1.loadModuleDependencyGraph, fileCacheItem.filePath, {
                        readFile: utils_1.getReadFile(state)
                    }, graph)];
            case 4:
                _b = _c.sent(), diagnostics = _b.diagnostics, newGraph = _b.graph;
                if (diagnostics.length) {
                    console.error("Failed to load dependency graph for " + fileCacheItem.filePath + ".");
                }
                graph = newGraph;
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, effects_1.put(actions_1.dependencyGraphLoaded(graph))];
            case 7:
                _c.sent();
                return [4 /*yield*/, effects_1.call(evaluatePreviews, graph, action.type === actions_1.FILE_CONTENT_CHANGED ? action.filePath : null)];
            case 8:
                _c.sent();
                return [3 /*break*/, 0];
            case 9: return [2 /*return*/];
        }
    });
}
function evaluatePreviews(graph, sourceUri) {
    var state, moduleSourceDirectory, _a, _b, _i, filePath, dep, module_1, _c, _d, component, _e, _f, preview, entry, document_1, prevDocument, _g, _h, newDocument, diff, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _k.sent();
                moduleSourceDirectory = utils_1.getModuleSourceDirectory(state);
                _a = [];
                for (_b in graph)
                    _a.push(_b);
                _i = 0;
                _k.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 11];
                filePath = _a[_i];
                dep = graph[filePath];
                if (sourceUri && sourceUri !== filePath && lodash_1.values(dep.resolvedImportUris).indexOf(sourceUri) === -1) {
                    return [3 /*break*/, 10];
                }
                module_1 = dep.module;
                if (!(module_1.type === paperclip_1.PCModuleType.COMPONENT)) return [3 /*break*/, 10];
                _c = 0, _d = module_1.components;
                _k.label = 3;
            case 3:
                if (!(_c < _d.length)) return [3 /*break*/, 10];
                component = _d[_c];
                _e = 0, _f = component.previews;
                _k.label = 4;
            case 4:
                if (!(_e < _f.length)) return [3 /*break*/, 9];
                preview = _f[_e];
                entry = {
                    componentId: component.id,
                    filePath: filePath,
                    previewName: preview.name
                };
                document_1 = paperclip_1.runPCFile({ entry: entry, graph: graph, directoryAliases: (_j = {},
                        // TODO - will eventually want to pass host and protocol information here too
                        _j[moduleSourceDirectory] = "http://localhost:" + state.options.port + constants_1.PUBLIC_SRC_DIR_PATH,
                        _j) }).document;
                _g = state_1.getLatestPreviewDocument;
                _h = [component.id, preview.name];
                return [4 /*yield*/, effects_1.select()];
            case 5:
                prevDocument = _g.apply(void 0, _h.concat([_k.sent()]));
                console.log("Evaluated component " + component.id + ":" + preview.name);
                newDocument = document_1;
                // TODO - push diagnostics too
                return [4 /*yield*/, effects_1.put(actions_1.previewEvaluated(component.id, preview.name, newDocument))];
            case 6:
                // TODO - push diagnostics too
                _k.sent();
                if (!prevDocument) return [3 /*break*/, 8];
                diff = slim_dom_1.diffNode(prevDocument, newDocument);
                // push even if there are no diffs so that FE can flag windows as loaded.
                return [4 /*yield*/, effects_1.put(actions_1.previewDiffed(component.id, preview.name, slim_dom_1.getDocumentChecksum(prevDocument), diff))];
            case 7:
                // push even if there are no diffs so that FE can flag windows as loaded.
                _k.sent();
                _k.label = 8;
            case 8:
                _e++;
                return [3 /*break*/, 4];
            case 9:
                _c++;
                return [3 /*break*/, 3];
            case 10:
                _i++;
                return [3 /*break*/, 2];
            case 11: return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=uri-watcher.js.map