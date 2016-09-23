import {
  IActor,
  Action,
  Observable,
  IObservable,
  IDisposable,
  Dependencies,
  ChangeAction,
  TypeWrapBus,
  DisposeAction,
  ReadFileAction,
  WatchFileAction,
  MainBusDependency,
  SingletonThenable,
  IReadFileActionResponseData,
  UpdateTemporaryFileContentAction,
} from "tandem-common";

import { throttle } from "lodash";

export interface IFileSystem {
  readFile(path: string): Promise<IReadFileActionResponseData>;
  writeFile(path: string, content: any): Promise<void>;
  watchFile(path: string, onChange: Function): IDisposable;
}

// TODO - use http for this instead of bus
export class FileSystem implements IFileSystem {

  private _bus: IActor;
  private _fileWatchers: any;

  constructor(dependencies: Dependencies) {
    this._bus = MainBusDependency.getInstance(dependencies);
    this._fileWatchers = {};
  }

  async readFile(path: string) {
    return ReadFileAction.execute({ path }, this._bus);
  }

  async writeFile(path: string, content: string) {
    return null;
  }

  watchFile(path: string, onFileChange: Function): IDisposable {
    if (this._fileWatchers[path]) {
      return this._fileWatchers[path].addCallback(onFileChange);
    }

    const watcher: FileWatcher = this._fileWatchers[path] = new FileWatcher(path, this._bus);

    watcher.observe(new TypeWrapBus(DisposeAction.DISPOSE, () => {
      this._fileWatchers[path] = undefined;
    }));

    return this.watchFile(path, onFileChange);
  }
}

class FileWatcher extends Observable {
  private _watcher: IDisposable;
  private _watcherCount: number = 0;

  constructor(private _path: string, private _bus: IActor) {
    super();
    this._watcher = WatchFileAction.execute(this._path, this._bus, this.onChange);
  }

  addCallback(onChange: Function) {
    const observer = new TypeWrapBus(ChangeAction.CHANGE, onChange);
    this.observe(observer);
    this._watcherCount++;
    return {
      dispose: () => {
        this.unobserve(observer);
        this._watcherCount--;
        if (this._watcherCount === 0) {
          this.dispose();
        }
      }
    };
  }

  dispose() {
    this._watcher.dispose();
    this.notify(new DisposeAction());
  }

  private onChange = () => {
    this.notify(new ChangeAction());
  }
}

const UPDATE_CACHE_THROTTLE = 100;

export class ProxyFileSystem implements IFileSystem {
  constructor(protected _target: IFileSystem) { }

  async readFile(path: string) {
    return this._target.readFile(path);
  }

  async writeFile(path: string, content: string) {
    return this._target.writeFile(path, content);
  }

  watchFile(path: string, onFileChange: Function): IDisposable {
    return this._target.watchFile(path, onFileChange);
  }
}

export class CachedFileSystem extends ProxyFileSystem implements IObservable {
  private _cache: any;
  private _observer: Observable;

  constructor(target: IFileSystem) {
    super(target);
    this._cache = {};
    this._observer = new Observable(this);
  }

  observe(actor: IActor) {
    this._observer.observe(actor);
  }

  unobserve(actor: IActor) {
    this._observer.unobserve(actor);
  }

  notify(action: Action) {
    return this._observer.notify(action);
  }

  async readFile(path: string) {
    return await this._cache[path] || (this._cache[path] = new SingletonThenable(async () => {
      const data = await super.readFile(path);

      // bust the cache if the file has changed.
      const watcher = this.watchFile(path, () => {
        this._cache[path] = undefined;
        watcher.dispose();
      });

      return data;
    }));
  }

  async writeFile(path: string, content: string) {
    this._cache[path] = undefined;
    return super.writeFile(path, content);
  }
}
