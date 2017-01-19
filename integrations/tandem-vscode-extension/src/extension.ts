
// TODOS:
// - load file cache when changing
// - connected notification
// - disconnected notification

"use strict";
// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "reflect-metadata";

import vscode = require("vscode");
import { TextEditorClient, TextEditorClientAdapter } from "tandem-client";
import { ISourceLocation, Status } from "@tandem/common";

class VSCodeTextEditorAdapter extends TextEditorClientAdapter {
    openFile(filePath: string, selection: ISourceLocation) {
        const setSelection = () => {
            let { start, end } = selection || { start: undefined, end: undefined };
            if (!end) end = start;
            if (start) {
                const range = new vscode.Range(
                    new vscode.Position(start.line - 1, start.column - 1),
                    new vscode.Position(end.line - 1, end.column)
                );

                vscode.window.activeTextEditor.selection = new vscode.Selection(
                    range.start,
                    range.end
                );

                vscode.window.activeTextEditor.revealRange(range);
            }
        }

        vscode.workspace.openTextDocument(filePath).then(async (doc) => {
            await vscode.window.showTextDocument(doc);
            setSelection();
        }, (e) => {
            console.error(e);
        })
    }

    getCurrentDocumentInfo() {
        const editor = vscode.window.activeTextEditor;
        const document = editor.document;
        return {
            uri: document.uri.toString(),
            content: document.getText(),
            dirty: document.isDirty
        }
    }

    onDidChangeTextDocument(callback: any) {
        vscode.workspace.onDidChangeTextDocument(callback);
    }

    onActiveTextEditorChange(callback: any) {
        vscode.window.onDidChangeActiveTextEditor(callback);
    }

    async setTextEditorContent(content: string) {

        const editor = vscode.window.activeTextEditor;
        const oldText = editor.document.getText();

        await editor.edit(function(edit) {
            edit.replace(
                new vscode.Range(
                    editor.document.positionAt(0),
                    editor.document.positionAt(oldText.length)
                ),
                content
            );
        });
    }
}

let _textClient: TextEditorClient;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    console.log("Activating Tandem client");

    const textClient = _textClient = new TextEditorClient(new VSCodeTextEditorAdapter());

    vscode.window.onDidChangeTextEditorSelection(function(e:vscode.TextEditorSelectionChangeEvent) {

        // ignore for now since this is fooing with selections when
        // using the visual editor. Need to figure out how to ignore selections when
        // not currently focused on visual studio.
        if (textClient.updatingTextEditorContent || 1 + 1) return;

        textClient.selectBySourceLocation(e.textEditor.document.fileName, e.selections.map(({ start, end }) => {
            return {
                start: { line: start.line + 1, column: start.character },
                end  : { line: end.line + 1, column: end.character }
            };
        }));
    });

    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

    statusBar.show();
    textClient.statusPropertyWatcher.connect((newStatus, oldStatus) => {
        if (newStatus.type === Status.LOADING) {
            statusBar.text = `$(alert) Tandem`;
            statusBar.tooltip = "Tandem is not currently connected.";
        } else if (newStatus.type === Status.COMPLETED) {
            statusBar.text = "$(zap) Tandem";
            statusBar.tooltip = "Tandem is connected.";
        }
    }).trigger();

    var disposable = vscode.commands.registerCommand('extension.openNewWindow', () => {
        const fileName = vscode.window.activeTextEditor.document.fileName;
        textClient.openNewWorkspace(fileName).catch((e) => {
            return vscode.window.showWarningMessage(e.message);
        });
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
    _textClient.dispose();
}