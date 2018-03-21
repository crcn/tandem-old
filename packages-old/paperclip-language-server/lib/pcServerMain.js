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
var vscode_languageserver_1 = require("vscode-languageserver");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var protocol_colorProvider_proposed_1 = require("vscode-languageserver-protocol/lib/protocol.colorProvider.proposed");
var vscode_uri_1 = require("vscode-uri");
var service_1 = require("./service");
var url = require("url");
var path = require("path");
var fsa = require("fs-extra");
var constants_1 = require("./constants");
// Create a connection for the server
var connection = process.argv.length <= 2
    ? vscode_languageserver_1.createConnection(process.stdin, process.stdout) // no arg specified
    : vscode_languageserver_1.createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
// Create a simple text document manager. The text document manager
// supports full document sync only
var documents = new vscode_languageserver_1.TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
var workspacePath;
var config = {};
var vls = service_1.getVls();
// After the server has started the client sends an initilize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilites
connection.onInitialize(function (params) {
    console.log('paperclip language server initialized');
    var initializationOptions = params.initializationOptions;
    workspacePath = params.rootPath;
    vls.initialize(workspacePath, initializationOptions.devToolsPort);
    documents.onDidClose(function (e) {
        vls.removeDocument(e.document);
    });
    connection.onShutdown(function () {
        vls.dispose();
    });
    try {
        fsa.emptyDirSync(constants_1.TMP_DIRECTORY);
    }
    catch (e) {
    }
    try {
        fsa.mkdirpSync(constants_1.TMP_DIRECTORY);
    }
    catch (e) {
    }
    var capabilities = {
        // Tell the client that the server works in FULL text document sync mode
        textDocumentSync: documents.syncKind,
        completionProvider: { resolveProvider: true, triggerCharacters: ['.', ':', '<', '"', '/', '@', '*'] },
        signatureHelpProvider: { triggerCharacters: ['('] },
        documentFormattingProvider: true,
        hoverProvider: true,
        documentHighlightProvider: true,
        documentSymbolProvider: true,
        definitionProvider: true,
        referencesProvider: true,
        colorProvider: true
    };
    return { capabilities: capabilities };
});
// The settings have changed. Is send on server activation as well.
connection.onDidChangeConfiguration(function (change) {
    config = change.settings;
    vls.configure(config);
    // Update formatting setting
    documents.all().forEach(triggerValidation);
});
var pendingValidationRequests = {};
var validationDelayMs = 200;
// When the text document first opened or when its content has changed.
documents.onDidChangeContent(function (change) {
    triggerValidation(change.document);
});
// A document has closed: clear all diagnostics
documents.onDidClose(function (event) {
    cleanPendingValidation(event.document);
    connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
});
function cleanPendingValidation(textDocument) {
    var request = pendingValidationRequests[textDocument.uri];
    if (request) {
        clearTimeout(request);
        delete pendingValidationRequests[textDocument.uri];
    }
}
function triggerValidation(textDocument) {
    cleanPendingValidation(textDocument);
    pendingValidationRequests[textDocument.uri] = setTimeout(function () {
        delete pendingValidationRequests[textDocument.uri];
        validateTextDocument(textDocument);
    }, validationDelayMs);
}
function validateTextDocument(textDocument) {
    return __awaiter(this, void 0, void 0, function () {
        var diagnostics;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vls.validate(textDocument, documents)];
                case 1:
                    diagnostics = _a.sent();
                    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics: diagnostics });
                    return [2 /*return*/];
            }
        });
    });
}
;
connection.onCompletion(function (textDocumentPosition) {
    var document = documents.get(textDocumentPosition.textDocument.uri);
    return vls.doComplete(document, textDocumentPosition.position);
});
connection.onCompletionResolve(function (item) {
    var data = item.data;
    if (data && data.languageId && data.uri) {
        var document_1 = documents.get(data.uri);
        return vls.doResolve(document_1, data.languageId, item);
    }
    return item;
});
connection.onHover(function (textDocumentPosition) {
    var document = documents.get(textDocumentPosition.textDocument.uri);
    return vls.doHover(document, textDocumentPosition.position);
});
connection.onDocumentHighlight(function (documentHighlightParams) {
    var document = documents.get(documentHighlightParams.textDocument.uri);
    return vls.findDocumentHighlight(document, documentHighlightParams.position);
});
connection.onDefinition(function (definitionParams) {
    var document = documents.get(definitionParams.textDocument.uri);
    return vls.findDefinition(document, definitionParams.position);
});
connection.onReferences(function (referenceParams) {
    var document = documents.get(referenceParams.textDocument.uri);
    return vls.findReferences(document, referenceParams.position);
});
connection.onSignatureHelp(function (signatureHelpParms) {
    var document = documents.get(signatureHelpParms.textDocument.uri);
    return vls.doSignatureHelp(document, signatureHelpParms.position);
});
connection.onDocumentFormatting(function (formatParams) {
    var document = documents.get(formatParams.textDocument.uri);
    var fullDocRange = vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(0, 0), document.positionAt(document.getText().length));
    return vls.format(document, fullDocRange, formatParams.options);
});
connection.onDocumentLinks(function (documentLinkParam) {
    var document = documents.get(documentLinkParam.textDocument.uri);
    var documentContext = {
        resolveReference: function (ref) {
            if (workspacePath && ref[0] === '/') {
                return vscode_uri_1.default.file(path.join(workspacePath, ref)).toString();
            }
            return url.resolve(document.uri, ref);
        }
    };
    return vls.findDocumentLinks(document, documentContext);
});
connection.onDocumentSymbol(function (documentSymbolParms) {
    var document = documents.get(documentSymbolParms.textDocument.uri);
    return vls.findDocumentSymbols(document);
});
connection.onRequest(protocol_colorProvider_proposed_1.DocumentColorRequest.type, function (params) {
    var document = documents.get(params.textDocument.uri);
    if (document) {
        return vls.findDocumentColors(document);
    }
    return [];
});
connection.onRequest(protocol_colorProvider_proposed_1.ColorPresentationRequest.type, function (params) {
    var document = documents.get(params.textDocument.uri);
    if (document) {
        return vls.getColorPresentations(document, params.color, params.range);
    }
    return [];
});
// Listen on the connection
connection.listen();
//# sourceMappingURL=pcServerMain.js.map