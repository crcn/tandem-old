'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
/// <reference path="./test.d.ts" />
const vscode = require('vscode');
const application_1 = require('saffron-back-end/lib/application');
const merge_1 = require('saffron-common/lib/utils/html/merge');
const child_process_1 = require('child_process');
const getPort = require('get-port');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const port = yield getPort();
        var server = new application_1.default({
            socketio: {
                port: port
            }
        });
        server.actors.push({
            execute(action) {
                if (action.type === 'didUpdate' &&
                    action.collectionName === 'files' &&
                    action.data[0].content !== _content) {
                    _setEditorContent(action.data[0].content);
                }
            }
        });
        server.initialize();
        var _inserted = false;
        var _content;
        var _documentUri;
        function _setEditorContent(content) {
            return __awaiter(this, void 0, void 0, function* () {
                let editor = vscode.window.visibleTextEditors.find(function (editor) {
                    return editor.document.uri == _documentUri;
                });
                let oldText = editor.document.getText();
                var newContent = _content = merge_1.default(oldText, content);
                yield editor.edit(function (edit) {
                    edit.replace(new vscode.Range(editor.document.positionAt(0), editor.document.positionAt(oldText.length)), newContent);
                });
            });
        }
        function _update(document) {
            _documentUri = document.uri;
            const path = '/root/file.sfn';
            return server.bus.execute({
                type: 'upsert',
                collectionName: 'files',
                query: {
                    path: path
                },
                data: {
                    path: path,
                    ext: 'sfn',
                    content: _content = document.getText()
                }
            }).read();
        }
        class SaffronDocumentContentProvider {
            constructor() {
                this._onDidChange = new vscode.EventEmitter();
                this._inserted = false;
            }
            provideTextDocumentContent(uri, token) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!this._inserted) {
                        yield _update(vscode.window.activeTextEditor.document);
                    }
                    return `
                <style>
                    body {
                        width: 100%;
                        height: 99%;
                        position: absolute;
                    }

                    .container {
                        width: 100%;
                        height: 100%;
                        border: none;
                    }
                </style>
                <body>
                    <iframe class="container" src="http://localhost:${port}/" />
                </body>
            `;
                });
            }
            get onDidChange() {
                return this._onDidChange.event;
            }
            unthrottleUpdate(uri) {
                console.log('unthrottle this');
            }
        }
        let previewUri = vscode.Uri.parse('saffron-preview://authority/saffron-preview');
        let provider = new SaffronDocumentContentProvider();
        let registration = vscode.workspace.registerTextDocumentContentProvider('saffron-preview', provider);
        let previewSaffronDocumentCommand = vscode.commands.registerCommand('extension.previewSaffronDocument', () => {
            vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two).then((success) => {
            });
        });
        let startServerCommand = vscode.commands.registerCommand('extension.startSaffronBackEnd', () => {
            child_process_1.exec(`open http://localhost:${port}`);
        });
        context.subscriptions.push(previewSaffronDocumentCommand, startServerCommand, registration);
        function onChange(e) {
            _update(e.document);
        }
        function run(e) {
            _update(e.document);
        }
        vscode.window.onDidChangeTextEditorSelection(function (e) {
            server.bus.execute({
                type: 'selectAtSourceOffset',
                data: e.selections.map(function (selection) {
                    return {
                        start: e.textEditor.document.offsetAt(selection.start),
                        end: e.textEditor.document.offsetAt(selection.end)
                    };
                })
            });
        });
        vscode.workspace.onDidChangeTextDocument(onChange);
        vscode.window.onDidChangeActiveTextEditor(run);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map