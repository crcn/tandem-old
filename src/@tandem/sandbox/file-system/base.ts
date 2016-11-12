import {
  IActor,
  inject,
  loggable,
  Logger,
  IDisposable,
  PrivateBusProvider,
} from "@tandem/common";

import {
  ReadFileAction,
  WatchFileAction,
} from "../actions";

export interface IFileWatcher extends IDisposable { }

export interface IReadFileResultItem {
  name: string;
  isDirectory: boolean;
}

export interface IFileSystem {
  readDirectory(directoryPath: string): Promise<IReadFileResultItem[]>
  readFile(filePath: string): Promise<any>;
  fileExists(filePath: string): Promise<boolean>;
  writeFile(filePath: string, content: any): Promise<any>;
  watchFile(filePath: string, onChange: () => any): IFileWatcher;
}

@loggable()
export abstract class BaseFileSystem implements IFileSystem {

  protected readonly logger: Logger;

  private _fileWatchers: any;

  constructor() {
    this._fileWatchers = {};
  }

  abstract readFile(filePath: string): Promise<any>;
  abstract readDirectory(directoryPath: string): Promise<IReadFileResultItem[]>;
  abstract fileExists(filePath: string): Promise<boolean>;
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