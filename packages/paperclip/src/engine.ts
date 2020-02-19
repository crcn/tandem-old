import { stripFileProtocol } from "./utils";
import { EngineEvent, EngineEventKind } from "./events";
import * as fs from "fs";
import * as path from "path";
import { NativeEngine } from "../native/pkg/paperclip";
import { PC_CONFIG_FILE_NAME } from "./constants";
import { PaperclipConfig } from "./config";

export type FileContent = {
  [identifier: string]: string;
};

export type EngineOptions = {
  httpuri?: string;
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
      uri => {
        return fs.existsSync(uri.replace("file://", ""));
      },
      resolveImportFile
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

export function resolveImportFile(fromPath: string, toPath: string) {
  if (/\w+:\/\//.test(toPath)) {
    return toPath;
  }

  if (toPath.charAt(0) !== ".") {
    return resolveModule(fromPath, toPath) || toPath;
  }

  return (
    "file://" +
    path.normalize(path.join(stripFileProtocol(path.dirname(fromPath)), toPath))
  );
}

function resolveModule(fromPath: string, moduleRelativePath: string) {
  const configPath = findPCConfigPath(fromPath);
  if (!configPath) return null;
  const config = require(configPath);
  if (!config.moduleDirectories) return null;
  const configPathDir = path.dirname(configPath);
  for (const moduleDirectory of config.moduleDirectories) {
    const moduleFilePath = path.normalize(
      path.join(configPathDir, moduleDirectory, moduleRelativePath)
    );
    if (fs.existsSync(moduleFilePath)) {
      return "file://" + moduleFilePath;
    }
  }
  return null;
}

const _triedDirectories = {};

function findPCConfigPath(fromPath: string): string | null {
  let cdir: string = path.dirname(fromPath.replace("file://", ""));
  do {
    const configPath = _triedDirectories[cdir];

    if (configPath == null) {
      _triedDirectories[cdir] = false;
      const configPath = path.join(cdir, PC_CONFIG_FILE_NAME);
      if (fs.existsSync(configPath)) {
        return (_triedDirectories[cdir] = configPath);
      }
    } else if (configPath) {
      return configPath;
    }
    cdir = path.dirname(cdir);
  } while (cdir !== "/" && cdir !== ".");
  return null;
}
