// import { noop } from "./keep";

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
import { CallbackDispatcher, NoopDispatcher, filterFamilyMessage, setMessageTarget } from "@tandem/mesh";

import { createCoreApplicationProviders, ServiceApplication } from "@tandem/core";
import { SelectSourceRequest, OpenFileRequest, SetCurrentFileRequest, EditorFamilyType } from "@tandem/editor/common";

import {
    FileCache,
    Dependency,
    FileCacheItem,
    LocalFileSystem,
    LocalFileResolver,
    FileCacheProvider,
    DependencyGraphProvider,
} from "@tandem/sandbox";

import { 
    CoreEvent,
    SockBus,
    Injector,
    serialize,
    IBrokerBus,
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

class TandemClient extends Observable {

    readonly fileCache: FileCache;
    readonly bus: IBrokerBus

    private _clientApp: ServiceApplication;
    private _process: ChildProcess;
    private _sockConnection: net.Socket;
    private _connected: boolean;
    private _sockFilePath: string;

    constructor() {
        super();
        this._connected = false;
        const deps = new Injector(
            createCoreApplicationProviders({})
        );

        this._clientApp = new ServiceApplication(deps);

        this.fileCache = FileCacheProvider.getInstance(deps);
        this.bus       = PrivateBusProvider.getInstance(deps);

        this.watchFileCache();
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
            setTimeout(this.connect.bind(this), 1000);
        }

        client.once("close", reconnect).once("error", reconnect);

         const sockBus = new SockBus({ family: EditorFamilyType.TEXT_EDITOR, connection: client, testMessage: filterFamilyMessage }, this.bus, {
            serialize, deserialize
        });

        this.bus.register(sockBus);
        this.fileCache.collection.reload();
    }

    private watchFileCache() {
        this.fileCache.collection.observe(new CallbackDispatcher(({ mutation }: MutationEvent<any>) => {
            if (mutation && mutation.type === PropertyMutation.PROPERTY_CHANGE) {
                if ((<PropertyMutation<any>>mutation).name === "url") {
                    this.notify(new FileCacheChangeEvent(mutation.target));
                }
            }
        }));
    }

}

let _client: TandemClient;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    const client = _client = new TandemClient();

    await client.connect();

    client.observe(new CallbackDispatcher((action: CoreEvent) => {
        if (action.type === FileCacheChangeEvent.FILE_CACHE_CHANGE) {
            setEditorContentFromCache((<FileCacheChangeEvent>action).item);
        }
    }));

    var _inserted = false;
    var _content;
    var _documentUri:vscode.Uri;
    var mtimes = {};
    var _ignoreSelect: boolean;

    async function setEditorContent({ content, filePath, mtime }) {

        const editor = vscode.window.activeTextEditor;
        if (mtime < mtimes[filePath]) return;

        if (editor.document.fileName !== filePath || editor.document.getText() === content) return;

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

    let _savingFileCache: boolean;
    let _shouldSaveFileCacheAgain: boolean;

    const updateFileCacheItem = async (document:vscode.TextDocument) => {

        if (_savingFileCache) {
            _shouldSaveFileCacheAgain = true;
            return;
        }

        _savingFileCache = true;

        _documentUri = document.uri;
        const editorContent = document.getText();
        const filePath = document.fileName;

        const fileCacheItem = await client.fileCache.item(filePath);

        if (fileCacheItem) {
            await fileCacheItem.setDataUrlContent(editorContent).save();
        }

        console.log("saved %s cache", filePath);

        _savingFileCache = false;

        if (_shouldSaveFileCacheAgain) {
            _shouldSaveFileCacheAgain = false;
            updateFileCacheItem(document);
        }

        setCurrentMtime();
    };

    async function onTextChange(e:vscode.TextDocumentChangeEvent) {
        const doc  = e.document;
        updateFileCacheItem(doc);
    }

    const setEditorContentFromCache = async (item: FileCacheItem) => {
        console.log("Setting file cache from", item.filePath);
        await openFileCacheTextDocument(item);
        await setEditorContent({
            filePath: item.filePath,
            content: String(await item.read()),
            mtime: item.updatedAt
        });
    }

    const setCurrentMtime = () => {
        mtimes[vscode.window.activeTextEditor.document.fileName] = Date.now();
    }

    const openFileCacheTextDocument = async (item: FileCacheItem)  => {
        if (vscode.window.activeTextEditor.document.fileName === item.filePath) return;
        console.log("Opening up %s tab", item.filePath);
        await vscode.workspace.openTextDocument(item.filePath);
    }

    async function onActiveTextEditorChange(e:vscode.TextEditor) {

        const doc      = e.document;
        const filePath = doc.fileName;
        setCurrentMtime();

        // must be loaded in
        const fileCacheItem = client.fileCache.eagerFindByFilePath(filePath);
        if (!fileCacheItem) return;

        const fileCacheItemContent = String(await fileCacheItem.read());

        // visual editor may have modified file content. Ensure that the editor
        // content is in sync with the latest stuff. TODO - need to match mtime here
        setEditorContentFromCache(fileCacheItem);
    }

    client.bus.register({
        dispatch({ filePath, selection, type }: SetCurrentFileRequest) {
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

                // quick fix for resolving relative files - this will break in the future.
                filePath = filePath.replace(/^\w+:\/\//, "");
                filePath = fs.existsSync(filePath) ? filePath : process.cwd() + filePath;
                vscode.workspace.openTextDocument(filePath).then(async (doc) => {
                    await vscode.window.showTextDocument(doc);
                    setSelection();
                }, setSelection);

                return true;
            }
        }
    })

    vscode.window.onDidChangeTextEditorSelection(function(e:vscode.TextEditorSelectionChangeEvent) {

        // ignore for now since this is fooing with selections when
        // using the visual editor. Need to figure out how to ignore selections when
        // not currently focused on visual studio.
        if (_ignoreSelect || 1 + 1) return;

        client.bus.dispatch(new SelectSourceRequest(e.textEditor.document.fileName, e.selections.map(({ start, end }) => {
            return {
                start: { line: start.line + 1, column: start.character },
                end  : { line: end.line + 1, column: end.character }
            };
        })));
    });

    // this needs to be a config setting
    vscode.workspace.onDidChangeTextDocument(onTextChange);
    vscode.window.onDidChangeActiveTextEditor(onActiveTextEditorChange);
}

// this method is called when your extension is deactivated
export function deactivate() {
    _client.disconnect();
}