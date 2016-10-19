import {
  IActor,
  IDisposable,
} from "@tandem/common";

import {
  OpenFileAction,
  ReadFileAction,
  WatchFileAction,
} from "./actions";

import * as fs from "fs";
import * as gaze from "gaze";

export interface IFileWatcher extends IDisposable { }


export interface IFileSystem {
  readFile(filePath: string): Promise<any>;
  // readDirectory(directory: string): Promise<string[]>;
  writeFile(filePath: string, content: any): Promise<any>;
  watchFile(filePath: string, onChange: () => any): IFileWatcher;
}

export abstract class BaseFileSystem implements IFileSystem {
  private _fileWatchers: any;

  constructor() {
    this._fileWatchers = {};
  }

  abstract readFile(filePath: string): Promise<any>;
  // abstract readDirectory(directory: string): Promise<string[]>;
  abstract writeFile(filePath: string, content: any): Promise<any>;

  public watchFile(filePath: string, onChange: () => any) {

    let _fileWatcher: { instance: IFileWatcher, listeners: Function[] };

    if (!(_fileWatcher = this._fileWatchers[filePath])) {
      _fileWatcher = this._fileWatchers[filePath] = {
        listeners: [],
        instance: this.watchFile2(filePath, () => {
          for (let i = _fileWatcher.listeners.length; i--;) {
            _fileWatcher.listeners[i]();
          }
        })
      }
    }

    const { listeners, instance } = _fileWatcher;

    listeners.push(onChange);

    return {
      dispose: () => {
        const index = listeners.indexOf(onChange);
        if (index === -1) return;
        listeners.splice(index, 1);
        if (listeners.length === 0) {
          instance.dispose();
        }
      }
    }
  }

  protected abstract watchFile2(filePath: string, onChange: () => any);
}

export class RemoteFileSystem extends BaseFileSystem {

  constructor(readonly bus: IActor) {
    super();
  }

  async readFile(filePath: string) {
    return await ReadFileAction.execute(filePath, this.bus);
  }

  async writeFile(filePath: string, content: any) {
    return Promise.reject(new Error("not implemented yet"))
  }

  watchFile2(filePath: string, onChange: () => any) {
    return WatchFileAction.execute(filePath, this.bus, onChange);
  }
}

export class LocalFileSystem extends BaseFileSystem {

  async readFile(filePath: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }

  async writeFile(filePath: string, content: any) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  watchFile2(filePath: string, onChange: () => any) {
    let currentMtime = fs.lstatSync(filePath).mtime.getTime();
    const watcher = fs.watch(filePath, function() {
      const newMtime = fs.lstatSync(filePath).mtime.getTime();
      if (newMtime === currentMtime) return;
      currentMtime = newMtime;
      onChange();
    });
    return {
      dispose: () => {
        watcher.close()
      }
    }
  }
}