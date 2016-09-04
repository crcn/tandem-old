"use strict";
// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from "vscode";
import * as createServer from "express";
import ServerApplication from "tandem-back-end/application";
import { WrapBus } from "mesh";
import { exec } from "child_process";
import * as getPort from "get-port";
import { debounce, throttle } from "lodash";

import {
    DSUpsertAction,
    OpenProjectAction,
    BaseApplicationService,
    ApplicationServiceDependency,
    UpdateTemporaryFileContentAction
} from "tandem-common";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    const port = await getPort();

    var server = new ServerApplication({
        port: port
    });

    class VSCodeService extends BaseApplicationService<ServerApplication> {
        async [UpdateTemporaryFileContentAction.UPDATE_TEMP_FILE_CONTENT](action: UpdateTemporaryFileContentAction) {
            _setEditorContent(action);
            // const uri = (await vscode.workspace.findFiles(action.path, "")).pop();
            // console.log(uri);
            console.log("UP", action.path);
            vscode.workspace.openTextDocument(action.path);
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

    const fixFileName = (fileName) => {

        // no extension? add HTML
        if (fileName.split(".")[0] === fileName) {
            fileName += ".html";
        }

        return fileName;
    }

    const _update = throttle(async (document:vscode.TextDocument) => {

        _documentUri = document.uri;
        const newContent = document.getText();

        if (_content === newContent) return;

        await UpdateTemporaryFileContentAction.execute({
            path: fixFileName(document.fileName),
            content: _content = newContent
        }, server.bus);
    }, 500);

    let startServerCommand = vscode.commands.registerCommand("extension.tandemOpenCurrentFile", () => {

        _update(vscode.window.activeTextEditor.document);

        return OpenProjectAction.execute({
            path: fixFileName(vscode.window.activeTextEditor.document.fileName)
        }, server.bus);
    });

    context.subscriptions.push(startServerCommand);

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

    exec(`open http://localhost:${port}`);
}

// this method is called when your extension is deactivated
export function deactivate() {
}