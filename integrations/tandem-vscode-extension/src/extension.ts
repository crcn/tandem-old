
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
import { TandemSockClient } from "tandem-client";

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
    OpenFileRequest,
    EditorFamilyType,
    SelectSourceRequest,
    SetCurrentFileRequest,
    OpenNewWorkspaceRequest,
} from "@tandem/editor/common";

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
    bindable,
    serialize,
    ISourceLocation,
    IBrokerBus,
    KernelProvider,
    Observable,
    deserialize,
    Status,
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

class TextEditorClientAdapterEvent extends CoreEvent {
    static readonly TEXT_CHANGE = "textChange";
}

 abstract class TextEditorClientAdapter extends Observable {
    constructor() {
        super();
    }

    abstract openFile(filename: string, selection: ISourceLocation);
    abstract setTextEditorContent(content: string);
    abstract onDidChangeTextDocument(callback: any);
    abstract getCurrentDocumentInfo(): { uri: string, content: string, dirty: boolean };
    abstract onActiveTextEditorChange(callback: any);
}

class TextEditorClient extends Observable {

    private _fileCachePromise: Promise<any>;
    private _settingTextContent: boolean;
    private _mtimes: {
        [Identifier: string]: number
    };

    constructor(readonly remote: TandemSockClient, readonly adapter: TextEditorClientAdapter) {
        super();
        this._mtimes = {};
        remote.bus.register(new CallbackDispatcher(this.onRemoteMessage.bind(this)));
        adapter.onDidChangeTextDocument(this.onDidChangeTextDocument.bind(this));
        adapter.onActiveTextEditorChange(this.onActiveTextEditorChange.bind(this));

        remote.statusPropertyWatcher.connect(this.onRemoteStatusChange.bind(this));
    }

    get kernel() {
        return this.remote.kernel;
    }

    get bus() {
        return this.remote.bus;
    }

    public dispose() {
        this.remote.dispose();
    }

    private onRemoteStatusChange(status: Status) {
        if (status.type === Status.COMPLETED) {
            this.watchFileCache();
        }
    }

    private onRemoteMessage(message: any) {
        if (message.type === SetCurrentFileRequest.SET_CURRENT_FILE) {
            const { uri, selection } = <SetCurrentFileRequest><any>message;
            let filePath = removeFileProtocolId(uri);
            filePath = fs.existsSync(filePath) ? filePath : process.cwd() + filePath;
            this.adapter.openFile(filePath, selection);
            return true;
        }
    }

    private watchFileCache() {
        DSTailRequest.dispatch(FILE_CACHE_COLLECTION_NAME, { }, this.bus).readable.pipeTo(new WritableStream({
            write: async ({ data }: DSTailedOperation) => {
                const item = new FileCacheItem(data, FILE_CACHE_COLLECTION_NAME);
                this.kernel.inject(item);
                this.setTextEditorContentFromFileCache(item);
            }
        }));
    }

    private onDidChangeTextDocument() {
        const { uri, content, dirty } = this.adapter.getCurrentDocumentInfo();
        if (this._settingTextContent || !dirty) return;
        this.updateFileCache(uri, content);
    }

    private async onActiveTextEditorChange() {

        const { uri, content } = this.adapter.getCurrentDocumentInfo();

        // must be loaded in
        const data = await DSFindRequest.findOne(FILE_CACHE_COLLECTION_NAME, {
            sourceUri: uri
        }, this.bus);

        if (!data) return;

        // timeout to give the editor some time to load up
        setTimeout(() => {
            // visual editor may have modified file content. Ensure that the editor
            // content is in sync with the latest stuff. TODO - need to match mtime here
            this.setTextEditorContentFromFileCache(this.kernel.inject(new FileCacheItem(data, FILE_CACHE_COLLECTION_NAME)));
        }, 100);
    }

    private async setTextEditorContentFromFileCache(item: FileCacheItem) {
        const currentTextDocumentInfo = this.adapter.getCurrentDocumentInfo();

        console.log(item.sourceUri, currentTextDocumentInfo.uri);
        if (item.sourceUri !== currentTextDocumentInfo.uri || (this._mtimes[item.sourceUri] || 0) >= item.contentUpdatedAt) {
            return;
        }

        this._settingTextContent = true;
        
        try {

            const content = String((await item.read()).content);

            if (currentTextDocumentInfo.content !== content) {
                await this.adapter.setTextEditorContent(content);
            }

        // must not block boolean flag
        } catch(e) {
            console.error(e.stack);
        }

        this._settingTextContent = false;
    }

    public updateFileCache(uri: string, content: string, mtime: number = Date.now()) {
        console.log(`updating file cache for ${uri}`);

        this._mtimes[uri] = mtime;

        if (this._fileCachePromise) {
            return this._fileCachePromise.then(() => {
                return this.updateFileCache(uri, content);
            });
        }

        return this._fileCachePromise = new Promise(async (resolve, reject) => {

            const filePath = removeFileProtocolId(uri);

            try {
                await this.bus.dispatch(new UpdateFileCacheRequest(uri, fs.readFileSync(filePath, "utf8") === content ? undefined : content, mtime))
            } catch(e) {
                console.error(e);
                reject(e);
            }

            this._fileCachePromise = undefined;
            resolve();

        });
    }

    get updatingTextEditorContent() {
        return this._settingTextContent;
    }

    public selectBySourceLocation(uri: string, ranges: ISourceLocation[]) {
        return this.bus.dispatch(new SelectSourceRequest(uri, ranges));
    }

    public async openNewWorkspace(filePath: string) {
        if (!/\.html$/.test(filePath)) {
            throw new Error("Only HTML files can be loaded in Tandem.");
        }

        if (this.remote.status.type !== Status.COMPLETED) {
            throw new Error("Tandem must be running to open files.");
        }

        await this.bus.dispatch(new OpenNewWorkspaceRequest(filePath));
    }
}

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

    const remoteClient = new TandemSockClient(EditorFamilyType.TEXT_EDITOR);

    const textClient = _textClient = new TextEditorClient(remoteClient, new VSCodeTextEditorAdapter());

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

    let spinTimer: NodeJS.Timer;
    let spinTick = 0;

    remoteClient.statusPropertyWatcher.connect((newStatus, oldStatus) => {
        clearInterval(spinTimer);
        spinTick = 0;

        if (newStatus.type === Status.LOADING) {
            spinTimer = setInterval(() => {
                const loaderParts = ["|", "/", "-", "\\"];
                statusBar.text = `${loaderParts[spinTick++ % loaderParts.length]} Tandem`;
            }, 100);

        } else if (newStatus.type === Status.COMPLETED) {
            statusBar.text = "$(zap) Tandem";
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