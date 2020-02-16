import { stripFileProtocol } from "./utils";
import { EngineEvent } from "./events";
import { spawn, ChildProcess } from "child_process";
const { Engine: NativeEngine } = require("../native/index.node");

import * as path from "path";
import * as getPort from "get-port";
const jasyon = require("jayson");

const DRAIN_TIMEOUT = 30;
const DRAIN_CALM_TIMEOUT = 1000;

export type FileContent = {
  [identifier: string]: string;
};

export type EngineOptions = {
  httpFilePath?: string;
  log?: boolean;
  renderPart?: string;
};

const noop = (...args) => {};

export type EngineEventListener = (event: EngineEvent) => void;

export class Engine {
  private _listeners: Array<EngineEventListener>;
  private _process: ChildProcess;
  private _watching: boolean;
  private _client;
  private _disposed: boolean;
  private _loaded: Promise<any>;
  private _native;

  constructor(private _options: EngineOptions = {}) {
    this._listeners = [];
    this._native = new NativeEngine(_options);
    // this._loaded = this.init(_options);
  }
  // async init(options: EngineOptions) {
  //   const port = await getPort();
  //   const args = [String(port)];
  //   if (options.httpFilePath) {
  //     args.push(options.httpFilePath);
  //   }

  //   this._client = jasyon.client.tcp({
  //     port
  //   } as any);

  //   this._process = spawn(
  //     path.join(__dirname, "..", "native", "target", "release", "paperclip"),
  //     args
  //   );

  //   if (options.log !== false) {
  //     this._process.stdout.on("data", data => {
  //       console.log("Paperclip Engine:", String(data));
  //     });
  //     this._process.on("close", code => {
  //       console.error(`ERR: ${code}`);
  //     });
  //   }

  //   this._process.once("close", () => {
  //     console.warn(`PC Engine closed`);
  //     this._process = undefined;
  //     if (this._disposed) return;
  //     this.init(options);
  //   });

  //   await new Promise(resolve => {
  //     this._process.stdout.once("data", data => {
  //       // crude, but works.
  //       if (String(data).indexOf("--READY--") !== -1) {
  //         resolve();
  //       }
  //     });
  //   });
  // }
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
  async parseFile(filePath: string) {
    return JSON.parse(this._native.parseFile(filePath));
    // return this._request("parse_file", {
    //   file_path: stripFileProtocol(filePath)
    // });
  }
  // async _request(command: string, params: any) {
  //   await this._loaded;
  //   return new Promise((resolve, reject) => {
  //     this._client.request(command, params, (err, response) => {
  //       if (err) return reject(err);
  //       const result = JSON.parse(response.result);
  //       if (result.error) return reject(result.error);
  //       resolve(result);
  //     });
  //   });
  // }
  evaluateFileStyles(filePath: string) {
    return JSON.parse(this._native.evaluateFileStyles(filePath));
    // return this._request("evaluate_file_styles", {
    //   file_path: stripFileProtocol(filePath)
    // });
  }
  evaluateContentStyles(content: string, filePath: string) {
    return JSON.parse(this._native.evaluateContentStyles(content, filePath));
    // return this._request("evaluate_content_styles", {
    //   content,
    //   file_path: stripFileProtocol(filePath)
    // });
  }
  parseContent(content: string) {
    return JSON.parse(this._native.parseContent(content));
  }
  async updateVirtualFileContent(filePath: string, content: string) {
    this._native.updateVirtualFileContent(filePath, content);
    // this._client.request(
    //   "update_virtual_file_content",
    //   { file_path: stripFileProtocol(filePath), content },
    //   noop
    // );
  }
  load(filePath: string) {
    this._native.load(filePath, this._options.renderPart);
    // await this._loaded;
    // this._watch();
    // this._client.request(
    //   "load",
    //   {
    //     file_path: stripFileProtocol(filePath),
    //     part: this._options.renderPart
    //   },
    //   noop
    // );
  }
  unload(filePath: string) {
    // TODO
  }
  dispose() {
    this._disposed = true;
    this._process.kill();
  }
  _watch() {
    if (this._watching) {
      return;
    }
    this._watching = true;
    const drainEvents = () => {
      if (this._disposed) return;
      const events = JSON.parse(this._native.drainEvents());
      for (const event of events) {
        for (const listener of this._listeners) {
          listener(event);
        }
      }
      setTimeout(drainEvents, DRAIN_TIMEOUT);
    };
    drainEvents();
  }
}

const e = new Engine();
const result = e.evaluateContentStyles(
  "<style> div { color: red; } </style> test",
  "ok"
);
console.log(result);
