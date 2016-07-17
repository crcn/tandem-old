'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
/// <reference path="./test.d.ts" />

import * as vscode from 'vscode';
import * as createServer from 'express'; 
import { WrapBus, NoopBus } from 'mesh';
import * as SocketIOBus from 'mesh-socket-io-bus';
import ServerApplication from 'saffron-back-end';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    var server = ServerApplication.create({
        config: {
            socketio: {
                port: 8090
            }
        }
    });
    
    server.initialize();

    class SaffronDocumentContentProvider {

        private _onDidChange:vscode.EventEmitter<any>;

        constructor() {
            this._onDidChange =  new vscode.EventEmitter<any>();
        }
        provideTextDocumentContent(uri, token) {

            var config = {
                socketio: {
                    port: 8090
                }
            };

            // console.log(encodeURIComponent(JSON.stringify(config)));

            return `
                <style type="text/css">
                    body {
                        position: absolute;
                        height: 99%;
                        width: 100%;
                    }
                    body > iframe {
                        border: none;
                        height: 100%;
                        width: 100%;

                    }
                </style>
                <body class='saffron-preview'>
                    <div id='app'></div>
                    <script src='http://localhost:8080/bundle/front-end.js' />
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