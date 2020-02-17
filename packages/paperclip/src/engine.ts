import { stripFileProtocol } from "./utils";
import { EngineEvent } from "./events";
import { ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { NativeEngine } from "../native/pkg/paperclip";

const DRAIN_TIMEOUT = 30;

export type FileContent = {
  [identifier: string]: string;
};

export type EngineOptions = {
  httpFilePath?: string;
  log?: boolean;
  renderPart?: string;
};

export type EngineEventListener = (event: EngineEvent) => void;

export class Engine {
  private _native: any;

  constructor(private _options: EngineOptions = {}) {
    this._native = NativeEngine.new(
      filePath => {
        return fs.readFileSync(filePath.replace("file://", ""), "utf8");
      },
      (fromPath, relativePath) => {
        // TODO - resolve from config
        return path.normalize(path.join(path.dirname(fromPath), relativePath));
      }
    );
  }
  onEvent(listener: EngineEventListener) {
    if (listener == null) {
      throw new Error(`listener cannot be undefined`);
    }
    this._native.addListener(event => listener(JSON.parse(event)));
    return () => {
      throw new Error("Cannot dispose listeners yet");
      // let i = this._listeners.indexOf(listener);
      // if (i !== -1) {
      //   this._listeners.splice(i, 1);
      // }
    };
  }
  parseFile(filePath: string) {
    return JSON.parse(this._native.parseFile(filePath));
  }
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
}
