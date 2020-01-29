import { stripFileProtocol } from "./utils";
import { EngineEvent } from "./events";

const { Engine: NativeEngine } = require("../native/index.node");

const DRAIN_TIMEOUT = 50;

export type FileContent = {
  [identifier: string]: string;
};

export type EngineOptions = {
  readFileSync?: (filePath: string) => string;
};

export type EngineEventListener = (event: EngineEvent) => void;

export class Engine {
  private _engine;
  private _listeners: Array<EngineEventListener>;
  constructor(options: EngineOptions = {}) {
    this._engine = new NativeEngine(options);
    this._listeners = [];
    this._watch();
  }
  onEvent(listener: EngineEventListener) {
    this._listeners.push(listener);
    return () => {
      let i = this._listeners.indexOf(listener);
      if (i !== -1) {
        this._listeners.splice(i, 1);
      }
    };
  }
  updateVirtualFileContent(filePath: string, content: string) {
    this._engine.updateVirtualFileContent(stripFileProtocol(filePath), content);
  }
  startRuntime(filePath: string, contents?: FileContent) {
    this._engine.startRuntime(stripFileProtocol(filePath), contents);
  }
  stopRuntime(filePath: string) {
    this._engine.stopRuntime(stripFileProtocol(filePath));
  }
  _watch() {
    const drainEvents = () => {
      for (const event of this._engine.drainEvents()) {
        for (const listener of this._listeners) {
          listener(event);
        }
      }
      setTimeout(drainEvents, DRAIN_TIMEOUT);
    };
    drainEvents();
  }
}
