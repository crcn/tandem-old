"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var languageModelCache_1 = require("../languageModelCache");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var serviceHost_1 = require("./serviceHost");
var findComponents_1 = require("./findComponents");
var prettier_1 = require("../../utils/prettier");
var paths_1 = require("../../utils/paths");
var vscode_uri_1 = require("vscode-uri");
var ts = require("typescript");
var _ = require("lodash");
var nullMode_1 = require("../nullMode");
function getJavascriptMode(documentRegions, workspacePath) {
    if (!workspacePath) {
        return __assign({}, nullMode_1.nullMode, { findComponents: function () { return []; } });
    }
    var jsDocuments = languageModelCache_1.getLanguageModelCache(10, 60, function (document) {
        var pcDocument = documentRegions.get(document);
        return pcDocument.getEmbeddedDocumentByType('script');
    });
    var serviceHost = serviceHost_1.getServiceHost(workspacePath, jsDocuments);
    var updateCurrentTextDocument = serviceHost.updateCurrentTextDocument, getScriptDocByFsPath = serviceHost.getScriptDocByFsPath;
    var config = {};
    return {
        getId: function () {
            return 'javascript';
        },
        configure: function (c) {
            config = c;
        },
        doValidation: function (doc) {
            var _a = updateCurrentTextDocument(doc), scriptDoc = _a.scriptDoc, service = _a.service;
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return [];
            }
            var fileFsPath = paths_1.getFileFsPath(doc.uri);
            var diagnostics = service.getSyntacticDiagnostics(fileFsPath).concat(service.getSemanticDiagnostics(fileFsPath));
            return diagnostics.map(function (diag) {
                // syntactic/semantic diagnostic always has start and length
                // so we can safely cast diag to TextSpan
                return {
                    range: convertRange(scriptDoc, diag),
                    severity: vscode_languageserver_types_1.DiagnosticSeverity.Error,
                    message: ts.flattenDiagnosticMessageText(diag.messageText, '\n')
                };
            });
        },
        doComplete: function (doc, position) {
            var _a = updateCurrentTextDocument(doc), scriptDoc = _a.scriptDoc, service = _a.service;
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return { isIncomplete: false, items: [] };
            }
            var fileFsPath = paths_1.getFileFsPath(doc.uri);
            var offset = scriptDoc.offsetAt(position);
            var completions = service.getCompletionsAtPosition(fileFsPath, offset);
            if (!completions) {
                return { isIncomplete: false, items: [] };
            }
            var entries = completions.entries.filter(function (entry) { return entry.name !== '__pcEditorBridge'; });
            return {
                isIncomplete: false,
                items: entries.map(function (entry, index) {
                    var range = entry.replacementSpan && convertRange(scriptDoc, entry.replacementSpan);
                    return {
                        uri: doc.uri,
                        position: position,
                        label: entry.name,
                        sortText: entry.sortText + index,
                        kind: convertKind(entry.kind),
                        textEdit: range && vscode_languageserver_types_1.TextEdit.replace(range, entry.name),
                        data: {
                            // data used for resolving item details (see 'doResolve')
                            languageId: scriptDoc.languageId,
                            uri: doc.uri,
                            offset: offset
                        }
                    };
                })
            };
        },
        doResolve: function (doc, item) {
            var service = updateCurrentTextDocument(doc).service;
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return nullMode_1.NULL_COMPLETION;
            }
            var fileFsPath = paths_1.getFileFsPath(doc.uri);
            var details = service.getCompletionEntryDetails(fileFsPath, item.data.offset, item.label);
            if (details) {
                item.detail = ts.displayPartsToString(details.displayParts);
                item.documentation = ts.displayPartsToString(details.documentation);
                delete item.data;
            }
            return item;
        },
        doHover: function (doc, position) {
            var _a = updateCurrentTextDocument(doc), scriptDoc = _a.scriptDoc, service = _a.service;
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return { contents: [] };
            }
            var fileFsPath = paths_1.getFileFsPath(doc.uri);
            var info = service.getQuickInfoAtPosition(fileFsPath, scriptDoc.offsetAt(position));
            if (info) {
                var display = ts.displayPartsToString(info.displayParts);
                var doc_1 = ts.displayPartsToString(info.documentation);
                var markedContents = [{ language: 'ts', value: display }];
                if (doc_1) {
                    markedContents.unshift(doc_1, '\n');
                }
                return {
                    range: convertRange(scriptDoc, info.textSpan),
                    contents: markedContents
                };
            }
            return { contents: [] };
        },
        doSignatureHelp: function (doc, position) {
            var _a = updateCurrentTextDocument(doc), scriptDoc = _a.scriptDoc, service = _a.service;
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return nullMode_1.NULL_SIGNATURE;
            }
            var fileFsPath = paths_1.getFileFsPath(doc.uri);
            var signHelp = service.getSignatureHelpItems(fileFsPath, scriptDoc.offsetAt(position));
            if (!signHelp) {
                return nullMode_1.NULL_SIGNATURE;
            }
            var ret = {
                activeSignature: signHelp.selectedItemIndex,
                activeParameter: signHelp.argumentIndex,
                signatures: []
            };
            signHelp.items.forEach(function (item) {
                var signature = {
                    label: '',
                    documentation: undefined,
                    parameters: []
                };
                signature.label += ts.displayPartsToString(item.prefixDisplayParts);
                item.parameters.forEach(function (p, i, a) {
                    var label = ts.displayPartsToString(p.displayParts);
                    var parameter = {
                        label: label,
                        documentation: ts.displayPartsToString(p.documentation)
                    };
                    signature.label += label;
                    signature.parameters.push(parameter);
                    if (i < a.length - 1) {
                        signature.label += ts.displayPartsToString(item.separatorDisplayParts);
                    }
                });
                signature.label += ts.displayPartsToString(item.suffixDisplayParts);
                ret.signatures.push(signature);
            });
            return ret;
        },
        findDocumentHighlight: function (doc, position) {
            var _a = updateCurrentTextDocument(doc), scriptDoc = _a.scriptDoc, service = _a.service;
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return [];
            }
            var fileFsPath = paths_1.getFileFsPath(doc.uri);
            var occurrences = service.getOccurrencesAtPosition(fileFsPath, scriptDoc.offsetAt(position));
            if (occurrences) {
                return occurrences.map(function (entry) {
                    return {
                        range: convertRange(scriptDoc, entry.textSpan),
                        kind: (entry.isWriteAccess
                            ? vscode_languageserver_types_1.DocumentHighlightKind.Write
                            : vscode_languageserver_types_1.DocumentHighlightKind.Text)
                    };
                });
            }
            return [];
        },
        findDocumentSymbols: function (doc) {
            var _a = updateCurrentTextDocument(doc), scriptDoc = _a.scriptDoc, service = _a.service;
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return [];
            }
            var fileFsPath = paths_1.getFileFsPath(doc.uri);
            var items = service.getNavigationBarItems(fileFsPath);
            if (items) {
                var result_1 = [];
                var existing_1 = {};
                var collectSymbols_1 = function (item, containerLabel) {
                    var sig = item.text + item.kind + item.spans[0].start;
                    if (item.kind !== 'script' && !existing_1[sig]) {
                        var symbol = {
                            name: item.text,
                            kind: convertSymbolKind(item.kind),
                            location: {
                                uri: doc.uri,
                                range: convertRange(scriptDoc, item.spans[0])
                            },
                            containerName: containerLabel
                        };
                        existing_1[sig] = true;
                        result_1.push(symbol);
                        containerLabel = item.text;
                    }
                    if (item.childItems && item.childItems.length > 0) {
                        for (var _i = 0, _a = item.childItems; _i < _a.length; _i++) {
                            var child = _a[_i];
                            collectSymbols_1(child, containerLabel);
                        }
                    }
                };
                items.forEach(function (item) { return collectSymbols_1(item); });
                return result_1;
            }
            return [];
        },
        findDefinition: function (doc, position) {
            var _a = updateCurrentTextDocument(doc), scriptDoc = _a.scriptDoc, service = _a.service;
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return [];
            }
            var fileFsPath = paths_1.getFileFsPath(doc.uri);
            var definitions = service.getDefinitionAtPosition(fileFsPath, scriptDoc.offsetAt(position));
            if (!definitions) {
                return [];
            }
            var definitionResults = [];
            var program = service.getProgram();
            definitions.forEach(function (d) {
                var sourceFile = program.getSourceFile(d.fileName);
                var definitionTargetDoc = vscode_languageserver_types_1.TextDocument.create(d.fileName, 'vue', 0, sourceFile.getText());
                definitionResults.push({
                    uri: vscode_uri_1.default.file(d.fileName).toString(),
                    range: convertRange(definitionTargetDoc, d.textSpan)
                });
            });
            return definitionResults;
        },
        findReferences: function (doc, position) {
            var _a = updateCurrentTextDocument(doc), scriptDoc = _a.scriptDoc, service = _a.service;
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return [];
            }
            var fileFsPath = paths_1.getFileFsPath(doc.uri);
            var references = service.getReferencesAtPosition(fileFsPath, scriptDoc.offsetAt(position));
            if (!references) {
                return [];
            }
            var referenceResults = [];
            references.forEach(function (r) {
                var referenceTargetDoc = getScriptDocByFsPath(fileFsPath);
                if (referenceTargetDoc) {
                    referenceResults.push({
                        uri: vscode_uri_1.default.file(r.fileName).toString(),
                        range: convertRange(referenceTargetDoc, r.textSpan)
                    });
                }
            });
            return referenceResults;
        },
        format: function (doc, range, formatParams) {
            var _a = updateCurrentTextDocument(doc), scriptDoc = _a.scriptDoc, service = _a.service;
            var defaultFormatter = config.tandem.paperclip.format.defaultFormatter.js;
            if (defaultFormatter === 'none') {
                return [];
            }
            var needIndent = config.tandem.paperclip.format.scriptInitialIndent;
            var parser = scriptDoc.languageId === 'javascript' ? 'babylon' : 'typescript';
            if (defaultFormatter === 'prettier') {
                var code = scriptDoc.getText();
                var filePath = paths_1.getFileFsPath(scriptDoc.uri);
                if (config.prettier.eslintIntegration) {
                    return prettier_1.prettierEslintify(code, filePath, range, needIndent, formatParams, config.prettier, parser);
                }
                else {
                    return prettier_1.prettierify(code, filePath, range, needIndent, formatParams, config.prettier, parser);
                }
            }
            else {
                var initialIndentLevel = needIndent ? 1 : 0;
                var formatSettings = scriptDoc.languageId === 'javascript' ? config.javascript.format : config.typescript.format;
                var convertedFormatSettings = convertOptions(formatSettings, formatParams, initialIndentLevel);
                var fileFsPath = paths_1.getFileFsPath(doc.uri);
                var start = scriptDoc.offsetAt(range.start);
                var end = scriptDoc.offsetAt(range.end);
                var edits = service.getFormattingEditsForRange(fileFsPath, start, end, convertedFormatSettings);
                if (edits) {
                    var result = [];
                    for (var _i = 0, edits_1 = edits; _i < edits_1.length; _i++) {
                        var edit = edits_1[_i];
                        if (edit.span.start >= start && edit.span.start + edit.span.length <= end) {
                            result.push({
                                range: convertRange(scriptDoc, edit.span),
                                newText: edit.newText
                            });
                        }
                    }
                    return result;
                }
                return [];
            }
        },
        findComponents: function (doc) {
            var service = updateCurrentTextDocument(doc).service;
            var fileFsPath = paths_1.getFileFsPath(doc.uri);
            return findComponents_1.findComponents(service, fileFsPath);
        },
        onDocumentRemoved: function (document) {
            jsDocuments.onDocumentRemoved(document);
        },
        dispose: function () {
            serviceHost.getService().dispose();
            jsDocuments.dispose();
        }
    };
}
exports.getJavascriptMode = getJavascriptMode;
function languageServiceIncludesFile(ls, documentUri) {
    var filePaths = ls.getProgram().getRootFileNames();
    var filePath = paths_1.getFilePath(documentUri);
    return filePaths.includes(filePath);
}
function convertRange(document, span) {
    var startPosition = document.positionAt(span.start);
    var endPosition = document.positionAt(span.start + span.length);
    return vscode_languageserver_types_1.Range.create(startPosition, endPosition);
}
function convertKind(kind) {
    switch (kind) {
        case 'primitive type':
        case 'keyword':
            return vscode_languageserver_types_1.CompletionItemKind.Keyword;
        case 'var':
        case 'local var':
            return vscode_languageserver_types_1.CompletionItemKind.Variable;
        case 'property':
        case 'getter':
        case 'setter':
            return vscode_languageserver_types_1.CompletionItemKind.Field;
        case 'function':
        case 'method':
        case 'construct':
        case 'call':
        case 'index':
            return vscode_languageserver_types_1.CompletionItemKind.Function;
        case 'enum':
            return vscode_languageserver_types_1.CompletionItemKind.Enum;
        case 'module':
            return vscode_languageserver_types_1.CompletionItemKind.Module;
        case 'class':
            return vscode_languageserver_types_1.CompletionItemKind.Class;
        case 'interface':
            return vscode_languageserver_types_1.CompletionItemKind.Interface;
        case 'warning':
            return vscode_languageserver_types_1.CompletionItemKind.File;
    }
    return vscode_languageserver_types_1.CompletionItemKind.Property;
}
function convertSymbolKind(kind) {
    switch (kind) {
        case 'var':
        case 'local var':
        case 'const':
            return vscode_languageserver_types_1.SymbolKind.Variable;
        case 'function':
        case 'local function':
            return vscode_languageserver_types_1.SymbolKind.Function;
        case 'enum':
            return vscode_languageserver_types_1.SymbolKind.Enum;
        case 'module':
            return vscode_languageserver_types_1.SymbolKind.Module;
        case 'class':
            return vscode_languageserver_types_1.SymbolKind.Class;
        case 'interface':
            return vscode_languageserver_types_1.SymbolKind.Interface;
        case 'method':
            return vscode_languageserver_types_1.SymbolKind.Method;
        case 'property':
        case 'getter':
        case 'setter':
            return vscode_languageserver_types_1.SymbolKind.Property;
    }
    return vscode_languageserver_types_1.SymbolKind.Variable;
}
function convertOptions(formatSettings, options, initialIndentLevel) {
    return _.assign(formatSettings, {
        convertTabsToSpaces: options.insertSpaces,
        tabSize: options.tabSize,
        indentSize: options.tabSize,
        baseIndentSize: options.tabSize * initialIndentLevel
    });
}
//# sourceMappingURL=javascript.js.map