import { stripFileProtocol } from "./utils";
import { EngineEvent } from "./events";
import { spawn, ChildProcess } from "child_process";
import * as path from "path";
import * as getPort from "get-port";
const jasyon = require("jayson");

const DRAIN_TIMEOUT = 50;

export type FileContent = {
  [identifier: string]: string;
};

export type EngineOptions = {
  httpFilePath?: string;
};

const noop = (...args) => {};

export type EngineEventListener = (event: EngineEvent) => void;

export class Engine {
  private _engine;
  private _listeners: Array<EngineEventListener>;
  private _process: ChildProcess;
  private _client;
  private _loaded: Promise<any>;

  constructor(options: EngineOptions = {}) {
    this.init(options);
  }
  async init(options: EngineOptions) {
    const port = await getPort();
    const args = [String(port)];
    if (options.httpFilePath) {
      args.push(options.httpFilePath);
    }
    this._client = jasyon.client.tcp({
      port
    } as any);

    this._process = spawn(
      path.join(__dirname, "..", "native", "target", "release", "paperclip"),
      args
    );

    this._process.stdout.on("data", data => {
      console.log("Paperclip Engine:", String(data));
    });

    this._listeners = [];

    // wait for child process to spawn. Problematic because of race conditions, but whatever.
    this._loaded = new Promise(resolve => setTimeout(resolve, 500));
    this._watch();
  }
  onEvent(listener: EngineEventListener) {
    if (listener == null) {
      throw new Error(`listener cannot be undefined`);
    }
    this._listeners.push(listener);
    return () => {
      let i = this._listeners.indexOf(listener);
      if (i !== -1) {
        this._listeners.splice(i, 1);
      }
    };
  }
  async updateVirtualFileContent(filePath: string, content: string) {
    await this._loaded;
    this._client.request(
      "update_virtual_file_content",
      { file_path: stripFileProtocol(filePath), content },
      noop
    );
  }
  async load(filePath: string) {
    await this._loaded;
    this._client.request(
      "load",
      { file_path: stripFileProtocol(filePath) },
      noop
    );
  }
  async unload(filePath: string) {
    await this._loaded;
    this._client.request(
      "unload",
      { file_path: stripFileProtocol(filePath) },
      noop
    );
  }
  _watch() {
    const drainEvents = () => {
      this._client.request("drain_events", [], (err, response) => {
        const events = JSON.parse(response.result);
        for (const event of events) {
          for (const listener of this._listeners) {
            listener(event);
          }
        }
        setTimeout(drainEvents, DRAIN_TIMEOUT);
      });
    };
    this._loaded.then(drainEvents);
  }
}
