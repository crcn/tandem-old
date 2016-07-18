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

    var _inserted = false;
    var _updateTimestamp;

    function _update(content) {
        const path = '/root/file.sfn';

        return server.bus.execute({
            type: 'upsert',
            collectionName: 'files',
            query: {
                path: path
            },
            data: {
                timestamp: _updateTimestamp = Date.now(),
                path: path,
                ext: 'sfn',
                content: content
            }
        }).read();
    }
    
    server.actors.push(WrapBus.create(function(action) {
        if (action.type !== 'update' || action.timestamp < _updateTimestamp) return;
        console.log('text did change')
    }));

    class SaffronDocumentContentProvider {

        private _onDidChange:vscode.EventEmitter<any>;
        private _inserted:boolean;

        constructor() {
            this._onDidChange =  new vscode.EventEmitter<any>();
            this._inserted = false;
        }

        async provideTextDocumentContent(uri, token) {

            if (!this._inserted) {
                await _update(vscode.window.activeTextEditor.document.getText());
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
                    <iframe class="container" src="http://localhost:8090/" />
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

    function onChange(e:vscode.TextDocumentChangeEvent) {
        _update(e.document.getText());
    }

    function run(e:vscode.TextEditor) {
        _update(e.document.getText());
    }

    vscode.workspace.onDidChangeTextDocument(onChange);

    vscode.window.onDidChangeActiveTextEditor(run);

}

// this method is called when your extension is deactivated
export function deactivate() {
}