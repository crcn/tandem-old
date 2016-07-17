'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    class SaffronDocumentContentProvider {

        private _onDidChange:vscode.EventEmitter<any>;

        constructor() {
            this._onDidChange =  new vscode.EventEmitter<any>();
        }
        provideTextDocumentContent(uri, token) {
            return `
                    <style type="text/css">
                        body {
                            position: absolute;
                            height: 100%;
                            width: 100%;
                        }
                        body iframe {
                            border: none;
                            height: 100%;
                            width: 100%;

                        }
                    </style>
                    <body class='saffron-preview'>

                        <iframe src='http://localhost:8080' />
                    </body>
            `;
        }

        get onDidChange() {
            return this._onDidChange.event;
        }

        unthrottleUpdate (uri) {
            console.log('unthrottle this');
        }
    }

    let previewUri = vscode.Uri.parse('saffron-preview://authority/saffron-preview');

    let provider = new SaffronDocumentContentProvider();
    let registration = vscode.workspace.registerTextDocumentContentProvider('saffron-preview', provider);

    let disposable = vscode.commands.registerCommand('extension.previewSaffronDocument', () => {

        vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two).then((success) => {

        }, (error) => {
            console.error('cannot display');
        })    
    });

    context.subscriptions.push(disposable, registration);

    function run(editor:vscode.TextEditor) {
        var text = editor.document.getText();
        console.log('text change', text);
    }

    function onChange(e:vscode.TextDocumentChangeEvent) {
        console.log(e.document.getText());
    }

    vscode.workspace.onDidChangeTextDocument(onChange);

    vscode.window.onDidChangeActiveTextEditor(run);
	if (vscode.window.activeTextEditor) {
        run(vscode.window.activeTextEditor);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {
}