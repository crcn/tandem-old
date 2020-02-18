import { stripFileProtocol } from "./utils";
import { EngineEvent, EngineEventKind } from "./events";
import * as fs from "fs";
import * as path from "path";
import { NativeEngine } from "../native/pkg/paperclip";

export type FileContent = {
  [identifier: string]: string;
};

export type EngineOptions = {
  httpuri?: string;
  log?: boolean;
  renderPart?: string;
};

export type EngineEventListener = (event: EngineEvent) => void;

export class Engine {
  private _native: any;
  private _listeners: EngineEventListener[] = [];

  constructor(private _options: EngineOptions = {}) {
    this._native = NativeEngine.new(
      uri => {
        return fs.readFileSync(uri.replace("file://", ""), "utf8");
      },
      (fromPath, relativePath) => {
        // TODO - resolve from config
        return (
          "file://" +
          path.normalize(
            path.join(stripFileProtocol(path.dirname(fromPath)), relativePath)
          )
        );
      }
    );

    // only one native listener to for buffer performance
    this._native.add_listener(this._dispatch);
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
  parseFile(uri: string) {
    return this._native.parse_file(uri);
  }
  evaluateFileStyles(uri: string) {
    return this._native.evaluate_file_styles(uri);
  }
  evaluateContentStyles(content: string, uri: string) {
    return this._native.evaluate_content_files(content, uri);
  }
  parseContent(content: string) {
    return this._native.parse_content(content);
  }
  updateVirtualFileContent(uri: string, content: string) {
    this._dispatch({ kind: EngineEventKind.Updating, uri });
    this._native.update_virtual_file_content(uri, content);
  }
  load(uri: string) {
    this._dispatch({ kind: EngineEventKind.Loading, uri });
    this._native.load(uri, this._options.renderPart);
  }
  private _dispatch = (event: EngineEvent) => {
    // try-catch since engine will throw opaque error.
    try {
      for (const listener of this._listeners) {
        listener(event);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
}
