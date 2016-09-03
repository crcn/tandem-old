"use strict";
// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from "vscode";
import * as createServer from "express";
import ServerApplication from "sf-back-end/application";
import { WrapBus } from "mesh";
import { exec } from "child_process";
import * as getPort from "get-port";

import {
    DSUpsertAction,
    OpenProjectAction,
    BaseApplicationService,
    ApplicationServiceDependency,
    UpdateTemporaryFileContentAction
} from "sf-common";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    const port = await getPort();

    var server = new ServerApplication({
        port: port
    });

    class VSCodeService extends BaseApplicationService<ServerApplication> {
        [UpdateTemporaryFileContentAction.UPDATE_TEMP_FILE_CONTENT](action: UpdateTemporaryFileContentAction) {
            _setEditorContent(action);
        }
    }

    server.dependencies.register(
        new ApplicationServiceDependency("vsCodeService", VSCodeService)
    );

    server.initialize();

    var _inserted = false;
    var _content;
    var _documentUri:vscode.Uri;

    async function _setEditorContent({ content, path }) {

        if (_content === content) return;

        let editor = vscode.window.visibleTextEditors.find(function(editor) {
            return editor.document.uri == _documentUri;
        });

        if (editor.document.fileName !== path) return;

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

    let initialFile;

    async function _update(document:vscode.TextDocument) {

        _documentUri = document.uri;
        const newContent = document.getText();

        if (_content === newContent) return;

        let fileName = document.fileName;

        // no extension? add HTML
        if (fileName.split(".")[0] === fileName) {
            fileName += ".html";
        }

        await UpdateTemporaryFileContentAction.execute({
            path: fileName,
            content: _content = newContent
        }, server.bus);

        if (initialFile && fileName !== initialFile) return;

        initialFile = fileName;

        return OpenProjectAction.execute({
            path: fileName
        }, server.bus);
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
    run(vscode.window.activeTextEditor);
    vscode.window.onDidChangeActiveTextEditor(run);
}

// this method is called when your extension is deactivated
export function deactivate() {
}