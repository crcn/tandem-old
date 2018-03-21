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
Object.defineProperty(exports, "__esModule", { value: true });
var languageModelCache_1 = require("../languageModelCache");
var fs = require("fs");
var paperclip_1 = require("paperclip");
var htmlCompletion_1 = require("./services/htmlCompletion");
var htmlHover_1 = require("./services/htmlHover");
var htmlHighlighting_1 = require("./services/htmlHighlighting");
var htmlLinks_1 = require("./services/htmlLinks");
var htmlSymbolsProvider_1 = require("./services/htmlSymbolsProvider");
var htmlFormat_1 = require("./services/htmlFormat");
var htmlParser_1 = require("./parser/htmlParser");
var htmlDefinition_1 = require("./services/htmlDefinition");
var tagProviders_1 = require("./tagProviders");
var tagProviders_2 = require("./tagProviders");
var _ = require("lodash");
var vscode_languageserver_1 = require("vscode-languageserver");
function getPaperclipHTMLMode(documentRegions, workspacePath, devToolsPort) {
    var tagProviderSettings = tagProviders_1.getTagProviderSettings(workspacePath);
    var enabledTagProviders = tagProviders_2.getEnabledTagProviders(tagProviderSettings);
    var embeddedDocuments = languageModelCache_1.getLanguageModelCache(10, 60, function (document) {
        return documentRegions.get(document).getEmbeddedDocument('paperclip');
    });
    var pcDocuments = languageModelCache_1.getLanguageModelCache(10, 60, function (document) { return htmlParser_1.parseHTMLDocument(document); });
    // const lintEngine = createLintEngine();
    var config = {};
    return {
        getId: function () {
            return 'paperclip';
        },
        configure: function (c) {
            tagProviderSettings = _.assign(tagProviderSettings, c.html.suggest);
            enabledTagProviders = tagProviders_2.getEnabledTagProviders(tagProviderSettings);
            config = c;
        },
        doValidation: function (document, allDocuments) {
            return __awaiter(this, void 0, void 0, function () {
                var embedded, allDiagnostics, _a, astDiagnostics, graph, dep, module_1, _i, _b, component, inferDiagnostics, lintDiagnostics, filterDoc;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            embedded = embeddedDocuments.get(document);
                            allDiagnostics = [];
                            return [4 /*yield*/, paperclip_1.loadModuleDependencyGraph(document.uri, {
                                    readFile: function (uri) {
                                        var doc = allDocuments.get(uri);
                                        return doc ? doc.getText() : fs.readFileSync(uri.replace("file://", ""), "utf8");
                                    }
                                })];
                        case 1:
                            _a = _c.sent(), astDiagnostics = _a.diagnostics, graph = _a.graph;
                            allDiagnostics.push.apply(allDiagnostics, astDiagnostics);
                            dep = graph[document.uri];
                            // dep may not be loaded if there are errors
                            if (dep) {
                                module_1 = dep.module;
                                for (_i = 0, _b = module_1.components; _i < _b.length; _i++) {
                                    component = _b[_i];
                                    inferDiagnostics = paperclip_1.inferNodeProps(component.source, document.uri).diagnostics;
                                    allDiagnostics.push.apply(allDiagnostics, inferDiagnostics);
                                }
                                lintDiagnostics = paperclip_1.lintDependencyGraph(graph).diagnostics;
                                allDiagnostics.push.apply(allDiagnostics, lintDiagnostics);
                            }
                            filterDoc = function (diag) { return diag.filePath === document.uri; };
                            return [2 /*return*/, allDiagnostics.filter(filterDoc).map(function (diag) {
                                    return ({
                                        range: {
                                            start: {
                                                line: diag.location.start.line - 1,
                                                character: diag.location.start.column
                                            },
                                            end: {
                                                line: diag.location.start.line - 1,
                                                character: diag.location.start.column,
                                            }
                                        },
                                        severity: (_a = {},
                                            _a[paperclip_1.DiagnosticType.ERROR] = vscode_languageserver_1.DiagnosticSeverity.Error,
                                            _a[paperclip_1.DiagnosticType.WARNING] = vscode_languageserver_1.DiagnosticSeverity.Warning,
                                            _a)[diag.type],
                                        message: diag.message
                                    });
                                    var _a;
                                })];
                    }
                });
            });
        },
        doComplete: function (document, position) {
            var embedded = embeddedDocuments.get(document);
            // const components = scriptMode.findComponents(document);
            var tagProviders = enabledTagProviders; //.concat(getComponentTags(components));
            return htmlCompletion_1.doComplete(embedded, position, pcDocuments.get(embedded), tagProviders);
        },
        doHover: function (document, position) {
            // const components = scriptMode.findComponents(document);
            var tagProviders = enabledTagProviders; //.concat(getComponentTags(components));
            return htmlHover_1.doHover(document, position, tagProviders, config, devToolsPort);
        },
        findDocumentHighlight: function (document, position) {
            return htmlHighlighting_1.findDocumentHighlights(document, position, pcDocuments.get(document));
        },
        findDocumentLinks: function (document, documentContext) {
            return htmlLinks_1.findDocumentLinks(document, documentContext);
        },
        findDocumentSymbols: function (document) {
            return htmlSymbolsProvider_1.findDocumentSymbols(document, pcDocuments.get(document));
        },
        format: function (document, range, formattingOptions) {
            if (config.tandem.paperclip.format.defaultFormatter.html === 'none') {
                return [];
            }
            return htmlFormat_1.htmlFormat(document, range, formattingOptions, config);
        },
        findDefinition: function (document, position) {
            var embedded = embeddedDocuments.get(document);
            // const components = scriptMode.findComponents(document);
            return htmlDefinition_1.findDefinition(embedded, position, pcDocuments.get(embedded), []);
        },
        onDocumentRemoved: function (document) {
            pcDocuments.onDocumentRemoved(document);
        },
        dispose: function () {
            pcDocuments.dispose();
        }
    };
}
exports.getPaperclipHTMLMode = getPaperclipHTMLMode;
//# sourceMappingURL=index.js.map