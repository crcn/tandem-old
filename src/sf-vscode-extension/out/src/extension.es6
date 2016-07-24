'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var mesh_1 = require('mesh');
var SocketIOBus = require('mesh-socket-io-bus');
var io = require('socket.io');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    var server = io();
    server.set('origins', '*domain.com*:*');
    var port = 8090;
    server.listen(port);
    server.on('connection', function (connection) {
        console.log('con');
    });
    var bus = SocketIOBus.create({
        connection: server
    }, mesh_1.WrapBus.create(function (action) {
        console.log('remote', action);
    }));
    var SaffronDocumentContentProvider = (function () {
        function SaffronDocumentContentProvider() {
            this._onDidChange = new vscode.EventEmitter();
        }
        SaffronDocumentContentProvider.prototype.provideTextDocumentContent = function (uri, token) {
            var config = {
                socketio: {
                    port: port
                }
            };
            // console.log(encodeURIComponent(JSON.stringify(config)));
            return "\n                <style type=\"text/css\">\n                    body {\n                        position: absolute;\n                        height: 99%;\n                        width: 100%;\n                    }\n                    body > iframe {\n                        border: none;\n                        height: 100%;\n                        width: 100%;\n\n                    }\n                </style>\n                <body class='saffron-preview'>\n                    <div id='app'></div>\n                    <script src='http://localhost:8080/bundle/front-end.js' />\n                </body>\n            ";
        };
        Object.defineProperty(SaffronDocumentContentProvider.prototype, "onDidChange", {
            get: function () {
                return this._onDidChange.event;
            },
            enumerable: true,
            configurable: true
        });
        SaffronDocumentContentProvider.prototype.unthrottleUpdate = function (uri) {
            console.log('unthrottle this');
        };
        return SaffronDocumentContentProvider;
    }());
    var previewUri = vscode.Uri.parse('saffron-preview://authority/saffron-preview');
    var provider = new SaffronDocumentContentProvider();
    var registration = vscode.workspace.registerTextDocumentContentProvider('saffron-preview', provider);
    var disposable = vscode.commands.registerCommand('extension.previewSaffronDocument', function () {
        vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two).then(function (success) {
        }, function (error) {
            console.error('cannot display');
        });
    });
    context.subscriptions.push(disposable, registration);
    function run(editor) {
        var text = editor.document.getText();
        console.log('text change', text);
    }
    function onChange(e) {
        console.log(e.document.getText());
    }
    vscode.workspace.onDidChangeTextDocument(onChange);
    vscode.window.onDidChangeActiveTextEditor(run);
    if (vscode.window.activeTextEditor) {
        run(vscode.window.activeTextEditor);
    }
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map