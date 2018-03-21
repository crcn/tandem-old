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
var vscode_languageserver_1 = require("vscode-languageserver");
var actions_1 = require("../actions");
var VALIDATE_MS = 200;
// inspired by https://github.com/vuejs/vetur/blob/master/server/src/vueServerMain.ts
function mainSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleConnectionSaga)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.mainSaga = mainSaga;
function handleConnectionSaga() {
    var connection, documents, config, pendingValidationRequests, clearPendingValidation, triggerValidation, validateTextDocument;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.take(actions_1.ACTIVATED)];
            case 1:
                _a.sent();
                connection = process.argv.length <= 2 ? vscode_languageserver_1.createConnection(process.stdin, process.stdout) : vscode_languageserver_1.createConnection();
                documents = new vscode_languageserver_1.TextDocuments();
                documents.listen(connection);
                config = {};
                pendingValidationRequests = {};
                connection.onInitialize(function (params) {
                    console.log("Initialized Paperclip server");
                    var capabilities = {
                        textDocumentSync: documents.syncKind,
                        completionProvider: {
                            resolveProvider: true,
                            triggerCharacters: [
                                "[",
                                "<"
                            ]
                        },
                        documentFormattingProvider: true,
                        hoverProvider: true,
                        documentHighlightProvider: true,
                        documentSymbolProvider: true,
                        definitionProvider: true,
                        referencesProvider: true,
                    };
                    return { capabilities: capabilities };
                });
                // The settings have changed. Is send on server activation as well.
                connection.onDidChangeConfiguration(function (change) {
                    config = change.settings;
                    // Update formatting setting
                    documents.all().forEach(triggerValidation);
                });
                documents.onDidChangeContent(function (change) {
                    triggerValidation(change.document);
                });
                clearPendingValidation = function (textDocument) {
                    var request = pendingValidationRequests[textDocument.uri];
                    if (request) {
                        clearTimeout(request);
                        delete pendingValidationRequests[textDocument.uri];
                    }
                };
                triggerValidation = function (document) {
                    clearPendingValidation(document);
                    pendingValidationRequests[document.uri] = setTimeout(function () {
                        delete pendingValidationRequests[document.uri];
                        validateTextDocument(document);
                    }, VALIDATE_MS);
                };
                validateTextDocument = function (document) {
                    console.log("VALIDATE");
                };
                connection.listen();
                return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=index.js.map