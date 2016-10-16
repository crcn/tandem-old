import {
  IActor,
  IDisposable,
  OpenFileAction,
  ReadFileAction,
  WatchFileAction,
  UpdateTemporaryFileContentAction
} from "@tandem/common";

import * as fs from "fs";
import * as gaze from "gaze";

export interface IFileWatcher extends IDisposable { }

export interface IFileSystem {
  readFile(fileName: string): Promise<any>;
  // readDirectory(directory: string): Promise<string[]>;
  writeFile(fileName: string, content: any): Promise<any>;
  watchFile(fileName: string, onChange: () => any): IFileWatcher;
}

export abstract class BaseFileSystem implements IFileSystem {
  private _fileWatchers: any;

  constructor() {
    this._fileWatchers = {};
  }

  abstract readFile(fileName: string): Promise<any>;
  // abstract readDirectory(directory: string): Promise<string[]>;
  abstract writeFile(fileName: string, content: any): Promise<any>;

  public watchFile(fileName: string, onChange: () => any) {

    let _fileWatcher: { instance: IFileWatcher, listeners: Function[] };

    if (!(_fileWatcher = this._fileWatchers[fileName])) {
      _fileWatcher = this._fileWatchers[fileName] = {
        listeners: [],
        instance: this.watchFile2(fileName, () => {
          for (const listener of _fileWatcher.listeners) {
            listener();
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

  protected abstract watchFile2(fileName: string, onChange: () => any);
}

export class RemoteFileSystem extends BaseFileSystem {

  constructor(readonly bus: IActor) {
    super();
  }

  async readFile(fileName: string) {
    return (await ReadFileAction.execute(fileName, this.bus)).content;
  }

  async writeFile(fileName: string, content: any) {
    return await UpdateTemporaryFileContentAction.execute({
      path: fileName,
      content: content
    }, this.bus);
  }

  watchFile2(fileName: string, onChange: () => any) {
    return WatchFileAction.execute(fileName, this.bus, onChange);
  }
}

export class LocalFileSystem {

  async readFile(fileName: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, "utf8", (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }

  async writeFile(fileName: string, content: any) {
    return new Promise((resolve, reject) => {
      // fs.writeFile()
      resolve();
    });
  }

  async watchFile(fileName: string, onChange: () => any) {
    const watcher = fs.watch(fileName, onChange);
    return {
      dispose: () => {
        watcher.close()
      }
    }
  }
}