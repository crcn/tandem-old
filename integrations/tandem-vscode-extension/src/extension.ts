"use strict";
// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from "vscode";
import * as createServer from "express";
import ServerApplication from "@tandem/back-end/application";
import { WrapBus } from "mesh";
import { exec } from "child_process";
import * as getPort from "get-port";
import { debounce, throttle } from "lodash";

import {
    DSUpsertAction,
    OpenProjectAction,
    BaseApplicationService,
    ApplicationServiceDependency,
    ReadTemporaryFileContentAction,
    UpdateTemporaryFileContentAction
} from "@tandem/common";

import {
    FilesSelectedAction,
    SelectEntitiesAtSourceOffsetAction,
} from "@tandem/front-end/actions";

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
            const uri = (await vscode.workspace.findFiles(action.path, "")).pop();
        }
        async [FilesSelectedAction.FILES_SELECTED](action: FilesSelectedAction) {
            const document = await vscode.workspace.openTextDocument(action.items[0].path);
            const editor = await vscode.window.showTextDocument(document);
        }
    }

    server.dependencies.register(
        new ApplicationServiceDependency("vsCodeService", VSCodeService)
    );

    server.initialize();

    var _inserted = false;
    var _content;
    var _documentUri:vscode.Uri;
    var _ignoreSelect: boolean;

    async function _setEditorContent({ content, path }) {

        if (_content === content) return;

        let editor = vscode.window.visibleTextEditors.find(function(editor) {
            return editor.document.uri == _documentUri;
        });

        if (editor.document.fileName !== path) return;

        let oldText = editor.document.getText();
        var newContent = _content = content;

        _ignoreSelect = true;

        await editor.edit(function(edit) {
            edit.replace(
                new vscode.Range(
                    editor.document.positionAt(0),
                    editor.document.positionAt(oldText.length)
                ),
                newContent
            );
        });

        _ignoreSelect = false;
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
        const editorContent = document.getText();
        const path = fixFileName(document.fileName);

        if (_content === editorContent) return;

        await UpdateTemporaryFileContentAction.execute({
            path: path,
            content: _content = editorContent
        }, server.bus);
    }, 25);

    let startServerCommand = vscode.commands.registerCommand("extension.tandemOpenCurrentFile", async () => {

        _update(vscode.window.activeTextEditor.document);

        const hasOpenWindow = (await OpenProjectAction.execute({
            path: fixFileName(vscode.window.activeTextEditor.document.fileName)
        }, server.bus));

        if (!hasOpenWindow) {
            exec(`open http://localhost:${port}`);
        }
    });

    context.subscriptions.push(startServerCommand);

    async function onChange(e:vscode.TextDocumentChangeEvent) {
        const doc  = e.document;
        _update(doc);
    }

    async function run(e:vscode.TextEditor) {
        const doc  = e.document;
        const path = fixFileName(doc.fileName);

        const editorContent = doc.getText();

        const cachedFile = await ReadTemporaryFileContentAction.execute({
            path: path
        }, server.bus);

        // cached content does not match, meaning that it likely changed in the browser
        if (cachedFile.content !== editorContent) {
            _setEditorContent({ path: doc.fileName, content: cachedFile.content });
        } else {
            _update(doc);
        }
    }

    vscode.window.onDidChangeTextEditorSelection(function(e:vscode.TextEditorSelectionChangeEvent) {
        if (_ignoreSelect) return;
        const ranges = e.selections.map(selection => ({
            start: e.textEditor.document.offsetAt(selection.start),
            end: e.textEditor.document.offsetAt(selection.end)
        }));
        server.bus.execute(new SelectEntitiesAtSourceOffsetAction(fixFileName(e.textEditor.document.fileName), ...ranges));
    });

    vscode.workspace.onDidChangeTextDocument(onChange);
    vscode.window.onDidChangeActiveTextEditor(run);
}

// this method is called when your extension is deactivated
export function deactivate() {
}