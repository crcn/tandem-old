import { stripFileProtocol } from "./utils";
import { EngineEvent } from "./events";
import { spawn, ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as getPort from "get-port";
const jasyon = require("jayson");
import { NativeEngine } from "../native/pkg/paperclip";

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
    this._native = NativeEngine.new(filePath => {
      console.log("read file", filePath);
      return fs.readFileSync(filePath.replace("file://", ""), "utf8");
    });
    this._watch();
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
  parseFile(filePath: string) {
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
    return JSON.parse(
      this._native.evaluateFileStyles(stripFileProtocol(filePath))
    );
  }
  evaluateContentStyles(content: string, filePath: string) {
    return JSON.parse(
      this._native.evaluateContentStyles(content, stripFileProtocol(filePath))
    );
  }
  parseContent(content: string) {
    return JSON.parse(this._native.parseContent(content));
  }
  updateVirtualFileContent(filePath: string, content: string) {
    this._native.updateVirtualFileContent(stripFileProtocol(filePath), content);
  }
  load(filePath: string) {
    this._native.load(stripFileProtocol(filePath), this._options.renderPart);
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

// const e = new Engine();
// const result = e.parseFile(
//   "/Users/crcn/Developer/work/tandem/public/packages/paperclip/examples/basic/main.pc"
// );
// console.log(result);
