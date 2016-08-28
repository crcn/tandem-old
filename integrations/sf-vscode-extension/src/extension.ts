"use strict";
// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
/// <reference path="./test.d.ts" />

import * as vscode from "vscode";
import * as createServer from "express";
import { WrapBus, NoopBus } from "mesh";
import * as SocketIOBus from "mesh-socket-io-bus";
import ServerApplication from "sf-back-end/application";
import { DSUpsertAction } from "sf-core/actions";
// import mergeHTML from "sf-common/utils/html/merge";
import { exec } from "child_process";
import * as getPort from "get-port";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    const port = await getPort();

    var server = new ServerApplication({
        port: port
    });

    server.bus.register({
        execute(action:any) {
            if (
                action.type === "dsDidUpdate" &&
                action.collectionName === "files" &&
                action.data[0].content !== _content
                ) {
                    _setEditorContent(action.data[0].content);
            }
        }
    })

    server.initialize();

    var _inserted = false;
    var _content;
    var _documentUri:vscode.Uri;

    async function _setEditorContent(content) {

        let editor = vscode.window.visibleTextEditors.find(function(editor) {
            return editor.document.uri == _documentUri;
        });

        let oldText = editor.document.getText();
        var newContent = _content = content;

        await editor.edit(function(edit) {
            edit.replace(
                new vscode.Range(
                    editor.document.positionAt(0),
                    editor.document.positionAt(oldText.length)
                ),
                newContent
            );
        });

    }

    function _update(document:vscode.TextDocument) {

        _documentUri = document.uri;
        const path = "/root/file.sfn";

        return server.bus.execute({
            type: "upsert",
            collectionName: "files",
            query: {
                path: path
            },
            data: {
                path: path,
                ext: "sfn",
                content: _content = document.getText()
            }
        } as any).read();
    }

    class SaffronDocumentContentProvider {

        private _onDidChange:vscode.EventEmitter<any>;
        private _inserted:boolean;

        constructor() {
            this._onDidChange =  new vscode.EventEmitter<any>();
            this._inserted = false;
        }

        async provideTextDocumentContent(uri, token) {

            if (!this._inserted) {
                await _update(vscode.window.activeTextEditor.document);
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
        }

        get onDidChange() {
            return this._onDidChange.event;
        }

        unthrottleUpdate (uri) {
            console.log("unthrottle this");
        }
    }

    let previewUri = vscode.Uri.parse("saffron-preview://authority/saffron-preview");

    let provider = new SaffronDocumentContentProvider();
    let registration = vscode.workspace.registerTextDocumentContentProvider("saffron-preview", provider);

    let previewSaffronDocumentCommand = vscode.commands.registerCommand("extension.previewSaffronDocument", () => {
        vscode.commands.executeCommand("vscode.previewHtml", previewUri, vscode.ViewColumn.Two).then((success) => {

        })
    });

    let startServerCommand = vscode.commands.registerCommand("extension.startSaffronBackEnd", () => {
        exec(`open http://localhost:${port}`);
    });

    context.subscriptions.push(previewSaffronDocumentCommand, startServerCommand, registration);

    function onChange(e:vscode.TextDocumentChangeEvent) {
        _update(e.document);
    }

    function run(e:vscode.TextEditor) {
        _update(e.document);
    }

    vscode.window.onDidChangeTextEditorSelection(function(e:vscode.TextEditorSelectionChangeEvent) {
        server.bus.execute({
            type: "selectAtSourceOffset",
            data: e.selections.map(function(selection) {
                return {
                    start: e.textEditor.document.offsetAt(selection.start),
                    end: e.textEditor.document.offsetAt(selection.end)
                };
            })
        } as any);
    });

    vscode.workspace.onDidChangeTextDocument(onChange);
    vscode.window.onDidChangeActiveTextEditor(run);
}

// this method is called when your extension is deactivated
export function deactivate() {
}