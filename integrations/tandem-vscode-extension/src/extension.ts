// import { noop } from "./keep";

"use strict";
// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "reflect-metadata";

import { exec, spawn, ChildProcess } from "child_process";
import { WrapBus } from "mesh";
import * as vscode from "vscode";
import * as net from "net";
import * as through from "through2";
import * as getPort from "get-port";
import * as fs from "fs";
import * as createServer from "express";
import { debounce, throttle } from "lodash";
import { NoopBus } from "mesh";

import { createCoreApplicationProviders, ServiceApplication } from "@tandem/core";
import { GetServerPortAction, OpenProjectAction, SelectSourceAction, OpenFileAction } from "@tandem/editor";

import {
    Dependency,
    FileCache,
    FileCacheItem,
    LocalFileSystem,
    LocalFileResolver,
    FileCacheProvider,
    DependencyGraphProvider,
} from "@tandem/sandbox";

import { 
    Action,
    SockBus,
    Injector,
    serialize,
    IBrokerBus,
    Observable,
    deserialize,
    PostDSAction,
    PrivateBusProvider,
    PropertyChangeAction,
} from "@tandem/common";

const UPDATE_FILE_CACHE_TIMEOUT = 100;

class FileCacheChangeAction extends Action{
    static readonly FILE_CACHE_CHANGE = "fileCachChange";
    constructor(readonly item: FileCacheItem) {
        super(FileCacheChangeAction.FILE_CACHE_CHANGE);
    }
}

class TandemClient extends Observable {

    readonly fileCache: FileCache;
    readonly bus: IBrokerBus
    public port: number;

    private _clientApp: ServiceApplication;
    private _process: ChildProcess;
    private _sockConnection: net.Socket;
    private _disconnected: boolean;
    private _sockFilePath: string;

    constructor() {
        super();
        this._disconnected = true;
        const deps = new Injector(
            createCoreApplicationProviders({})
        );

        this._clientApp = new ServiceApplication(deps);

        this.fileCache = FileCacheProvider.getInstance(deps);
        this.bus       = PrivateBusProvider.getInstance(deps);

        this.watchFileCache();
    }

    async disconnect() {
        this._disconnected = true;
        console.log("Disconnecting");
        if (this._process) {
            this._process.kill();
        }
        if (this._sockConnection) {
            this._sockConnection.end();
        }
    }

    async connect() {
        if (this._disconnected !== true) return;

        const sockFilePath = await this.getSocketFilePath();

        console.log("Connecting to the server");
        const client = this._sockConnection = net.connect({ path: sockFilePath } as any);
        const sockBus = new SockBus(client, this.bus, {
            serialize, deserialize
        });

        this.bus.register(sockBus);
        this.fileCache.collection.reload();
        let _reconnecting = false;
        const reconnect = () => {
            if (_reconnecting) return;
            _reconnecting = true;
            this.bus.unregister(sockBus);

            // reconnect on close -- only after a short TTL
            if (!this._disconnected)  {
                setTimeout(this.connect.bind(this), 1000);
            }
        }

        client.once("close", reconnect).once("error", reconnect);
        this.port = await GetServerPortAction.execute(this.bus);
    }

    private async getSocketFilePath() {
        if (this._sockFilePath) return this._sockFilePath;

        if (this._process) {
            this._process.kill();
        }

        console.log("Retrieving socket file");

        // isolate the td process so that it doesn't compete with resources
        // with VSCode.
        const tdproc = this._process = spawn(`node`, ["server-entry.js", "--expose-sock-file", "--no-banner", "--terminate"], {
            cwd: __dirname + "/../../../../node_modules/@tandem/editor"
        });

        tdproc.stdout.pipe(process.stdout);
        tdproc.stderr.pipe(process.stderr);

        return this._sockFilePath = await new Promise<string>((resolve) => {

            const sockBuffer = [];
            tdproc.stdout.pipe(through(function(chunk, enc:any, callback) {
                const value = String(chunk);

                // TODO - need util function for this
                const match = value.match(/\-+sock file start\-+\n(.*?)\n\-+sock file end\-+/);

                if (match) {
                    resolve(match[1]);
                }
            }))
        });
    }

    private watchFileCache() {
        this.fileCache.collection.observe(new WrapBus((action: Action) => {
            if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
                const changeAction = <PropertyChangeAction>action;
                if (changeAction.property === "url") {
                    this.notify(new FileCacheChangeAction(changeAction.target));
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

    client.observe(new WrapBus((action) => {
        if (action.type === FileCacheChangeAction.FILE_CACHE_CHANGE) {
            setEditorContentFromCache((<FileCacheChangeAction>action).item);
        }
    }));

    var _inserted = false;
    var _content;
    var _documentUri:vscode.Uri;
    var mtimes = {};
    var _ignoreSelect: boolean;

    async function setEditorContent({ content, filePath, mtime }) {

        const editor = vscode.window.activeTextEditor;
        console.log(vscode.window.visibleTextEditors);
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

    const updateFileCacheItem = throttle(async (document:vscode.TextDocument) => {

        // don't update file cache for now on edit -- clobbers the server. Need
        // to resolve issues before unlocking this feature.
        // if (1 + 1) return;

        _documentUri = document.uri;
        const editorContent = document.getText();
        const filePath = document.fileName;

        const fileCacheItem = await client.fileCache.eagerFindByFilePath(filePath);
        if (!fileCacheItem) return;

        fileCacheItem.setDataUrlContent(editorContent).save();
        setCurrentMtime();
    }, UPDATE_FILE_CACHE_TIMEOUT);

    let openProjectCommand = vscode.commands.registerCommand("extension.tandemOpenCurrentFile", async () => {

        const doc = vscode.window.activeTextEditor.document;
        const fileName = doc.fileName;

        updateFileCacheItem(vscode.window.activeTextEditor.document);

        // TODO - prompt to save file if it doesn't currently exist
        const hasOpenWindow = await OpenProjectAction.execute({
            filePath: fileName
        }, client.bus);

        if (!hasOpenWindow) {
            exec(`open http://localhost:${client.port}/editor`);
        }
    });

    let syncCommand = vscode.commands.registerCommand("extension.tandemSyncLive", async () => {
        client.connect();
        vscode.window.showInformationMessage("Now synchronizing realtime text changes with Tandem");
    });

    let stopCommand = vscode.commands.registerCommand("extension.tandemStop", async () => {
        client.disconnect();
        vscode.window.showInformationMessage("Text changes will no longer be synchronized with Tandem");
    });

    context.subscriptions.push(openProjectCommand, syncCommand);

    async function onTextChange(e:vscode.TextDocumentChangeEvent) {
        const doc  = e.document;
        updateFileCacheItem(doc);
    }

    const setEditorContentFromCache = async (item: FileCacheItem) => {
        console.log("Setting file cache from %s", item.filePath);
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
        execute({ filePath, selection, type }: OpenFileAction) {

            if (type === OpenFileAction.OPEN_FILE) {

                // quick fix for resolving relative files - this will break in the future.
                filePath = filePath.replace(/^\w+:\/\//, "");
                filePath = fs.existsSync(filePath) ? filePath : process.cwd() + filePath;
                vscode.workspace.openTextDocument(filePath).then(async (doc) => {
                    let { start, end } = selection || { start: undefined, end: undefined };
                    if (!end) end = start;

                    await vscode.window.showTextDocument(doc);

                    if (start)
                    vscode.window.activeTextEditor.selection = new vscode.Selection(
                        new vscode.Position(start.line - 1, start.line),
                        new vscode.Position(end.line - 1, end.line)
                    );
                });
            }
        }
    })

    vscode.window.onDidChangeTextEditorSelection(function(e:vscode.TextEditorSelectionChangeEvent) {

        // ignore for now since this is fooing with selections when
        // using the visual editor. Need to figure out how to ignore selections when
        // not currently focused on visual studio.
        if (_ignoreSelect || 1 + 1) return;

        client.bus.execute(new SelectSourceAction(e.textEditor.document.fileName, e.selections.map(({ start, end }) => {
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