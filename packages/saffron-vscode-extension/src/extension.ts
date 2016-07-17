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

        async provideTextDocumentContent(uri, token) {

            await server.bus.execute({
                type: 'insert',
                collectionName: 'files',
                data: {
                    path: '/root/file.sfn',
                    ext: 'sfn',
                    content: '<div style="background-color:#F60;width:1024px;height:768px;position:absolute;"></div>'
                }
            }).read();

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
                    <iframe class="container" src="http://localhost:8090/" />
                </body>
            `;

            // return (await server.bus.execute({
            //     type: 'getIndexHtmlContent'
            // }).read()).value;
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