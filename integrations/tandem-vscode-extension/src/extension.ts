
// TODOS:
// - load file cache when changing 
// - connected notification
// - disconnected notification

"use strict";
// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "reflect-metadata";

import { exec, spawn, ChildProcess } from "child_process";
import net =  require("net");
import os =  require("os");
import fs =  require("fs");
import path =  require("path");
import vscode = require("vscode");
import through =  require("through2");
import getPort =  require("get-port");
import createServer =  require("express");
import { 
    WritableStream,
    CallbackDispatcher, 
    NoopDispatcher, 
    filterFamilyMessage, 
    setMessageTarget, 
    DSUpdateRequest, 
    DSTailRequest,
    DSTailedOperation,
    DSFindRequest, 
    DSInsertRequest, 
    DSRemoveRequest,
} from "@tandem/mesh";

import { 
    SelectSourceRequest, 
    OpenFileRequest, 
    OpenNewWorkspaceRequest, 
    SetCurrentFileRequest, EditorFamilyType } from "@tandem/editor/common";

import {
    FileCache,
    Dependency,
    FileCacheItem,
    FileCacheProvider,
    createSandboxProviders,
    DependencyGraphProvider,
    UpdateFileCacheRequest,
    FILE_CACHE_COLLECTION_NAME,
} from "@tandem/sandbox";

import { 
    CoreEvent,
    SockBus,
    BrokerBus,
    Kernel,
    serialize,
    IBrokerBus,
    KernelProvider,
    Observable,
    deserialize,
    PostDSMessage,
    PrivateBusProvider,
    MutationEvent,
    PropertyMutation
} from "@tandem/common";

const UPDATE_FILE_CACHE_TIMEOUT = 100;

class FileCacheChangeEvent extends CoreEvent{
    static readonly FILE_CACHE_CHANGE = "fileCachChange";
    constructor(readonly item: FileCacheItem) {
        super(FileCacheChangeEvent.FILE_CACHE_CHANGE);
    }
}

const TD_SOCK_FILE = path.join(os.tmpdir(), `tandem-${process.env.USER}.sock`);

function removeFileProtocolId(value: string) {
    return value.replace(/file:\/\//, "");
}

class TandemClient extends Observable {

    readonly bus: IBrokerBus;
    private _process: ChildProcess;
    private _sockConnection: net.Socket;
    private _connected: boolean;
    private _sockFilePath: string;
    readonly kernel: Kernel;

    constructor() {
        super();
        this._connected = false;
        const deps = this.kernel = new Kernel(
            new PrivateBusProvider(new BrokerBus()),
            new KernelProvider(),
            createSandboxProviders(),
        );

        this.bus       = PrivateBusProvider.getInstance(deps);

    }

    async disconnect() {
        this._connected = false;
        console.log("Disconnecting");
        if (this._process) {
            this._process.kill();
        }
        if (this._sockConnection) {
            this._sockConnection.end();
        }
    }

    connect() {
        if (this._connected) return;
        this._connected = true;

        const sockFilePath = TD_SOCK_FILE;

        console.log("Connecting to the server");
        const client = this._sockConnection = net.connect({ path: sockFilePath } as any);

        const reconnect = () => {
            console.log("Socket closed");
            if (!this._connected) return;
            this._connected = false;
            this.bus.unregister(sockBus);
            setTimeout(this.connect.bind(this), 1000 * 5);
        }

        client.once("close", reconnect).once("error", reconnect);

         const sockBus = new SockBus({ family: EditorFamilyType.TEXT_EDITOR, connection: client, testMessage: filterFamilyMessage }, this.bus, {
            serialize, deserialize
        });

        this.bus.register(sockBus);

        this.watchFileCache();
    }

    private watchFileCache() {
        DSTailRequest.dispatch(FILE_CACHE_COLLECTION_NAME, { }, this.bus).readable.pipeTo(new WritableStream({
            write: ({ data }: DSTailedOperation) => {
                this.notify(new FileCacheChangeEvent(this.kernel.inject(new FileCacheItem(data, FILE_CACHE_COLLECTION_NAME))));
            }
        }));
    }

}

let _client: TandemClient;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    console.log("Activating Tandem client");

    const client = _client = new TandemClient();

    await client.connect();

    client.observe(new CallbackDispatcher((action: CoreEvent) => {
        if (action.type === FileCacheChangeEvent.FILE_CACHE_CHANGE) {
            setEditorContentFromCache((<FileCacheChangeEvent>action).item);
        }
    }));

    var _content;
    var _documentUri:vscode.Uri;
    var mtimes = {};
    let _editing: boolean;

    async function setEditorContent({ content, filePath, mtime }) {

        const editor = vscode.window.activeTextEditor;
        if (mtime < mtimes[filePath]) return;

        if (editor.document.fileName !== filePath || editor.document.getText() === content) return;

        let oldText = editor.document.getText();
        var newContent = _content = content;

        _editing = true;

        await editor.edit(function(edit) {
            edit.replace(
                new vscode.Range(
                    editor.document.positionAt(0),
                    editor.document.positionAt(oldText.length)
                ),
                newContent
            );
        });

        _editing = false;
    }

    let _savingFileCache: boolean;
    let _shouldSaveFileCacheAgain: boolean;

    const updateFileCacheItem = async (document:vscode.TextDocument) => {

        const mtime = setCurrentMtime();

        if (_savingFileCache) {
            _shouldSaveFileCacheAgain = true;
            return;
        }

        _savingFileCache = true;

        _documentUri = document.uri;
        const editorContent = document.getText();
        const filePath = document.fileName;
        let uri = "file://" + filePath;

        await client.bus.dispatch(new UpdateFileCacheRequest(uri, fs.readFileSync(filePath, "utf8") === editorContent ? undefined : editorContent, mtime));
        _savingFileCache = false;

        if (_shouldSaveFileCacheAgain) {
            _shouldSaveFileCacheAgain = false;
            updateFileCacheItem(document);
        }
    };

    async function onTextChange(e:vscode.TextDocumentChangeEvent) {
        if (_editing) return;
        const doc  = e.document;
        if (doc.isDirty) {
            updateFileCacheItem(doc);
        }
    }

    const setEditorContentFromCache = async (item: FileCacheItem) => {
        await setEditorContent({
            filePath: removeFileProtocolId(item.sourceUri),
            content: String((await item.read()).content),
            mtime: item.contentUpdatedAt
        });
    }

    const setCurrentMtime = () => {
        return mtimes[vscode.window.activeTextEditor.document.fileName] = Date.now();
    }

    const openFileCacheTextDocument = async (item: FileCacheItem)  => {
        const filePath = removeFileProtocolId(item.sourceUri);
        if (vscode.window.activeTextEditor.document.fileName === filePath) return;
        await vscode.workspace.openTextDocument(filePath);
    }

    async function onActiveTextEditorChange(e:vscode.TextEditor) {

        const doc      = e.document;
        const filePath = doc.fileName;

        // must be loaded in
        const data = await DSFindRequest.findOne(FILE_CACHE_COLLECTION_NAME, {
            sourceUri: "file://" + filePath
        }, client.bus);

        if (!data) return;

        // timeout to give the editor some time to load up
        setTimeout(() => {
            // visual editor may have modified file content. Ensure that the editor
            // content is in sync with the latest stuff. TODO - need to match mtime here
            setEditorContentFromCache(client.kernel.inject(new FileCacheItem(data, FILE_CACHE_COLLECTION_NAME)));
        }, 100);
    }

    client.bus.register({
        dispatch({ uri, selection, type }: SetCurrentFileRequest) {
            console.log(type);
            if (type === SetCurrentFileRequest.SET_CURRENT_FILE) {
                
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

                let filePath = removeFileProtocolId(uri);

                filePath = fs.existsSync(filePath) ? filePath : process.cwd() + filePath;

                vscode.workspace.openTextDocument(filePath).then(async (doc) => {
                    await vscode.window.showTextDocument(doc);
                    setSelection();
                }, (e) => {
                    console.error(e);
                })

                return true;
            }
        }
    })

    vscode.window.onDidChangeTextEditorSelection(function(e:vscode.TextEditorSelectionChangeEvent) {

        // ignore for now since this is fooing with selections when
        // using the visual editor. Need to figure out how to ignore selections when
        // not currently focused on visual studio.
        if (_editing || 1 + 1) return;

        client.bus.dispatch(new SelectSourceRequest(e.textEditor.document.fileName, e.selections.map(({ start, end }) => {
            return {
                start: { line: start.line + 1, column: start.character },
                end  : { line: end.line + 1, column: end.character }
            };
        })));
    });

    var disposable = vscode.commands.registerCommand('tandem.openNewWindow', () => {
        client.bus.dispatch(new OpenNewWorkspaceRequest(vscode.window.activeTextEditor.document.fileName));
	});
	
	context.subscriptions.push(disposable);
    vscode.workspace.onDidChangeTextDocument(onTextChange);
    vscode.window.onDidChangeActiveTextEditor(onActiveTextEditorChange);
}

// this method is called when your extension is deactivated
export function deactivate() {
    _client.disconnect();
}