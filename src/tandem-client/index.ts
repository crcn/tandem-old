import net = require("net");
import os = require("os");
import path = require("path");
import fs = require("fs");

import { debounce } from "lodash";


import { 
  PingRequest, 
  EditorFamilyType, 
  SelectSourceRequest,
  SetCurrentFileRequest,
  OpenNewWorkspaceRequest, 
} from "@tandem/editor/common";

import { 
  IDispatcher, 
  readOneChunk, 
  WritableStream,
  DSTailRequest,
  DSFindRequest,
  TransformStream,
  DSTailedOperation,
  CallbackDispatcher,
  filterFamilyMessage, 
} from "@tandem/mesh";

import { 
  FileCacheItem,
  createSandboxProviders,
  UpdateFileCacheRequest, 
  FILE_CACHE_COLLECTION_NAME,
} from "@tandem/sandbox";

import {
  Kernel,
  Status,
  SockBus,
  bindable,
  BrokerBus,
  serialize, 
  CoreEvent,
  Observable,
  deserialize,
  IDisposable,
  KernelProvider,
  ISourceLocation,
  PropertyWatcher,
  PrivateBusProvider,
} from "@tandem/common";

const SOCK_FILE = path.join(os.tmpdir(), `tandem-${process.env.USER}.sock`);

export type RemoteBusType = IDispatcher<any, any> & IDisposable;

export abstract class BaseTandemClient extends Observable implements IDisposable {
  readonly kernel: Kernel;
  readonly bus: BrokerBus;
  private _connected: boolean;
  private _remoteBus: RemoteBusType;

  @bindable()
  public status: Status = new Status(Status.IDLE);

  readonly statusPropertyWatcher: PropertyWatcher<BaseTandemClient, Status>;

  constructor() {
    super();

    this.statusPropertyWatcher = new PropertyWatcher<BaseTandemClient, Status>(this, "status");

    this.kernel = new Kernel(
      new KernelProvider(),
      new PrivateBusProvider(this.bus = new BrokerBus()),
     createSandboxProviders()
    );

    this._connect();
  }

  private async _connect() {
    if (this._connected) return;
    this._connected = true;

    this.status = new Status(Status.LOADING);

    const reconnect = () => {
      if (!this._connected) return;
      this._connected = false;
      this.bus.unregister(remoteBus);
      setTimeout(this._connect.bind(this), 1000);
    }

    const remoteBus = this._remoteBus = this._createRemoteBus(reconnect);
    this.bus.register(remoteBus);

    // ping the remote tandem app to ensure that we have a connection here -- this information
    // is typically displayed to the user.
    const ping = async () => {
      const { value, done } = await readOneChunk(this.bus.dispatch(new PingRequest()));
      if (!value) return setTimeout(ping, 1000);
      this.status = new Status(Status.COMPLETED);
    }

    ping();
  }

  dispose() {
    if (this._remoteBus) {
      this._remoteBus.dispose();
    }
  }
  protected abstract _createRemoteBus(onClose: () => any): RemoteBusType;
}

/**
 * .sock file (local) client for communicating
 * with tandem instance running on the same machine.
 */

export class TandemSockClient extends BaseTandemClient {
  private _connection: net.Socket;

  constructor(readonly family: string) {
    super();
  }

  dispose() {
    super.dispose();
    if (this._connection) {
      this._connection.end();
    }
  }
  
  protected _createRemoteBus(onClose: () => any) {
    
    const connection = net.connect({ path: SOCK_FILE } as any);

    const remoteBus = new SockBus({ family: this.family, connection: connection, testMessage: filterFamilyMessage }, this.bus, { serialize, deserialize });
    connection.once("close", onClose).once("error", onClose);

    return {
      dispatch(message) {
        return remoteBus.dispatch(message);
      },
      dispose() {
        connection.end();
        remoteBus.dispose();
      }
    }
  }
}


function removeFileProtocolId(value: string) {
    return value.replace(/file:\/\//, "");
}

 export abstract class TextEditorClientAdapter extends Observable {
    constructor() {
        super();
    }

    abstract openFile(filename: string, selection: ISourceLocation);
    abstract setTextEditorContent(content: string);
    abstract onDidChangeTextDocument(callback: any);
    abstract getCurrentDocumentInfo(): { uri: string, content: string, dirty: boolean };
    abstract onActiveTextEditorChange(callback: any);
}

export class TextEditorClient {

    private _settingTextContent: boolean;
    private _remote: BaseTandemClient;

    private _mtimes: {
        [Identifier: string]: number
    };

    private _fileCachePromises: {
        [Identifier: string]: Promise<any>
    }

    private _saveAgainFileCachePromiseData: {
        [Identifier: string]: { content: string, mtime: number }
    }

    constructor(readonly adapter: TextEditorClientAdapter, createTandemClient = (family: string) => new TandemSockClient(family)) {
        this._mtimes = {};
        this._fileCachePromises = {};
        this._saveAgainFileCachePromiseData = {};
        const remote = this._remote = createTandemClient(EditorFamilyType.TEXT_EDITOR);

        remote.bus.register(new CallbackDispatcher(this.onRemoteMessage.bind(this)));
        adapter.onDidChangeTextDocument(this.onDidChangeTextDocument.bind(this));
        adapter.onActiveTextEditorChange(this.onActiveTextEditorChange.bind(this));

        remote.statusPropertyWatcher.connect(this.onRemoteStatusChange.bind(this));
    }

    get status() {
      return this._remote.status;
    }
    
    get statusPropertyWatcher() {
      return this._remote.statusPropertyWatcher;
    }

    get kernel() {
        return this._remote.kernel;
    }

    get bus() {
        return this._remote.bus;
    }

    public dispose() {
        this._remote.dispose();
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

    // debounced to give the text editor to set dirty flag to true -- required
    // in vscode specifically.
    private onDidChangeTextDocument = debounce(async () => {
        const { uri, content, dirty } = this.adapter.getCurrentDocumentInfo();
        if (this._settingTextContent || !dirty) return;
        this.updateFileCache(uri, content);
    }, 50)

    private async onActiveTextEditorChange() {

        const { uri, content } = this.adapter.getCurrentDocumentInfo();

        // must be loaded inx
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
        console.log("Setting text editor content from file cache: ", item.sourceUri, currentTextDocumentInfo.uri, this._mtimes[item.sourceUri], item.contentUpdatedAt);
        if (item.sourceUri !== currentTextDocumentInfo.uri || (this._mtimes[item.sourceUri] || 0) >= item.contentUpdatedAt) {
            return;
        }

        this._settingTextContent = true;
        
        try {
            console.log("checking text content match")

            const content = String((await item.read()).content);

            if (currentTextDocumentInfo.content !== content) {
                await this.adapter.setTextEditorContent(content);
            } else {
                console.log("Content is the same -- not setting text");
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

        if (this._fileCachePromises[uri]) {

            this._saveAgainFileCachePromiseData[uri] = { content, mtime };
            
            return this._fileCachePromises[uri].then(() => {
                this._fileCachePromises[uri] = undefined;

                // save only the most recently updated data
                if (this._saveAgainFileCachePromiseData[uri]) {
                    const { content, mtime } = this._saveAgainFileCachePromiseData[uri];
                    this._saveAgainFileCachePromiseData[uri] = undefined;
                    return this.updateFileCache(uri, content, mtime);
                } else {
                    return Promise.resolve();
                }
            });
        }

        return this._fileCachePromises[uri] = new Promise(async (resolve, reject) => {

            const filePath = removeFileProtocolId(uri);

            try {
                await this.bus.dispatch(new UpdateFileCacheRequest(uri, fs.readFileSync(filePath, "utf8") === content ? undefined : content, mtime))
            } catch(e) {
                console.error(e);
                reject(e);
            }

            this._fileCachePromises[uri] = undefined;
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
        if (!/\.(html|tandem)$/.test(filePath)) {
            throw new Error("Only .html & .tandem files can be loaded in Tandem.");
        }

        if (this._remote.status.type !== Status.COMPLETED) {
            throw new Error("Tandem must be running to open files.");
        }

        await this.bus.dispatch(new OpenNewWorkspaceRequest(filePath));
    }
}