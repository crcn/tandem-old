"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_1 = require("vscode-languageserver");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var protocol_colorProvider_proposed_1 = require("vscode-languageserver-protocol/lib/protocol.colorProvider.proposed");
var vscode_uri_1 = require("vscode-uri");
var service_1 = require("./service");
var url = require("url");
var path = require("path");
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
    console.log('vetur initialized');
    var initializationOptions = params.initializationOptions;
    workspacePath = params.rootPath;
    vls.initialize(workspacePath);
    documents.onDidClose(function (e) {
        vls.removeDocument(e.document);
    });
    connection.onShutdown(function () {
        vls.dispose();
    });
    if (initializationOptions) {
        config = initializationOptions.config;
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
    var diagnostics = vls.validate(textDocument);
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics: diagnostics });
}
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
//# sourceMappingURL=vueServerMain.js.map