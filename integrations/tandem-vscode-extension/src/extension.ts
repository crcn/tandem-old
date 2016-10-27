// import { noop } from "./keep";

"use strict";
// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "reflect-metadata";

import { exec, spawn } from "child_process";
import { WrapBus } from "mesh";
import * as vscode from "vscode";
import * as net from "net";
import * as through from "through2";
import * as getPort from "get-port";
import * as createServer from "express";
import { debounce, throttle } from "lodash";
import { NoopBus } from "mesh";

import { GetServerPortAction, OpenProjectAction } from "@tandem/editor";
import { createCoreApplicationDependencies, ServiceApplication } from "@tandem/core";
import { SockBus, Dependencies, PrivateBusDependency, Action, PostDSAction, PropertyChangeAction } from "@tandem/common";
import { LocalFileSystem, LocalFileResolver, BundlerDependency, FileCacheDependency, FileCacheItem } from "@tandem/sandbox";

const UPDATE_FILE_CACHE_TIMEOUT = 25;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    // isolate the td process so that it doesn't compete with resources
    // with VSCode.
    const tdproc = spawn(`node`, ["server-entry.js", "--expose-sock-file"], {
        cwd: process.cwd() + "/node_modules/@tandem/editor"
    });

    tdproc.stdout.pipe(process.stdout);
    tdproc.stderr.pipe(process.stderr);

    tdproc.once("exit", (code) => {
        console.log("Tandem process exited.", code);
    });

    const sockFilePath = await new Promise((resolve) => {

        const sockBuffer = [];
        tdproc.stdout.pipe(through(function(chunk, enc:any, callback) {
            const value = String(chunk);

            // TODO - need util function for this
            const match = value.match(/\-+sock file start\-+\n(.*?)\n\-+sock file end\-+/);

            if (match) {
                resolve(match[1])
            }

            callback();
        }))
    });

    const deps = new Dependencies(
        createCoreApplicationDependencies({})
    );

    const clientApp = new ServiceApplication(deps);

    await clientApp.initialize();
    const bus = PrivateBusDependency.getInstance(deps);

    const client = net.connect({ path: sockFilePath } as any);

    // connect with the main process
    bus.register(new SockBus(client, bus));

    const port      = await GetServerPortAction.execute(bus);
    const bundler   = BundlerDependency.getInstance(deps);
    const fileCache = FileCacheDependency.getInstance(deps);

    fileCache.collection.observe(new WrapBus((action: Action) => {
        if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
            const changeAction = <PropertyChangeAction>action;
            if (changeAction.property === "url") {
                setEditorContentFromCache(changeAction.target);
            }
        }
    }));

    var _inserted = false;
    var _content;
    var _documentUri:vscode.Uri;
    var _mtime: number = Date.now();
    var _ignoreSelect: boolean;

    async function setEditorContent({ content, filePath, mtime }) {

        const editor = vscode.window.activeTextEditor;
        // if (mtime < _mtime) return;

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
        if (1 + 1) return;

        _documentUri = document.uri;
        const editorContent = document.getText();
        const filePath = document.fileName;

        const fileCacheItem = await fileCache.item(filePath);
        await fileCacheItem.setDataUrl(editorContent).save();
    }, UPDATE_FILE_CACHE_TIMEOUT);

    let startServerCommand = vscode.commands.registerCommand("extension.tandemOpenCurrentFile", async () => {

        const doc = vscode.window.activeTextEditor.document;
        const fileName = doc.fileName;

        updateFileCacheItem(vscode.window.activeTextEditor.document);

        // TODO - prompt to save file if it doesn't currently exist
        const hasOpenWindow = await OpenProjectAction.execute({
            filePath: fileName
        }, bus);

        if (!hasOpenWindow) {
            exec(`open http://localhost:${port}/editor`);
        }
    });

    context.subscriptions.push(startServerCommand);

    async function onTextChange(e:vscode.TextDocumentChangeEvent) {
        const doc  = e.document;
        _mtime    = Date.now();
        updateFileCacheItem(doc);
    }

    const setEditorContentFromCache = async (item: FileCacheItem) => {
        await setEditorContent({
            filePath: item.filePath,
            content: await item.read(),
            mtime: item.mtime
        });
    }

    async function onActiveTextEditorChange(e:vscode.TextEditor) {

        const doc      = e.document;
        const filePath = doc.fileName;

        const fileCacheItem = await fileCache.item(filePath);
        const fileCacheItemContent = await fileCacheItem.read();

        // visual editor may have modified file content. Ensure that the editor
        // content is in sync with the latest stuff. TODO - need to match mtime here
        setEditorContentFromCache(fileCacheItem);
    }

    vscode.window.onDidChangeTextEditorSelection(function(e:vscode.TextEditorSelectionChangeEvent) {
        if (_ignoreSelect) return;
        const ranges = e.selections.map(selection => ({
            start: e.textEditor.document.offsetAt(selection.start),
            end: e.textEditor.document.offsetAt(selection.end)
        }));

        // TODO -
        // server.bus.execute(new SelectEntitiesAtSourceOffsetAction(fixFileName(e.textEditor.document.fileName), ...ranges));
    });

    // this needs to be a config setting
    vscode.workspace.onDidChangeTextDocument(onTextChange);
    vscode.window.onDidChangeActiveTextEditor(onActiveTextEditorChange);
}

// this method is called when your extension is deactivated
export function deactivate() {
}