import { Sandbox } from "./sandbox";
import { IFileSystem } from "./file-system";
import { FileSystemDependency } from "./dependencies";
import { IModule, BaseSandboxModule } from "./module";
import { SandboxModuleFactoryDependency } from "./dependencies";
import { uniq } from "lodash";
import {
  Logger,
  IActor,
  Action,
  loggable,
  IInvoker,
  DSFindAction,
  DSUpdateAction,
  DSInsertAction,
  DSRemoveAction,
  Observable,
  Dependencies,
  watchProperty,
  ResolveAction,
  ChangeAction,
  BaseActiveRecord,
  MainBusDependency,
  SingletonThenable,
  MimeTypeDependency,
  PropertyChangeAction,
} from "@tandem/common";

import {
  SandboxModuleAction,
  ModuleImporterAction,
} from "./actions";

import {
  WrapBus
} from "mesh";

export interface IModuleResolveOptions {
  extensions: string[];
  directories: string[];
}

export class EmptyModule extends BaseSandboxModule {
  constructor(fileName: string, exports: any, sandbox: Sandbox) {
    super(fileName, null, sandbox);
  }
  load() { }
  evaluate() { return {}; }
}

interface IFileCacheSource {
  filePath: string;
  url?: string;
  mtime?: number;
}

class FileCacheItem extends BaseActiveRecord {

  static readonly COLLECTION_NAME = "fileCache";
  public filePath: string;
  public url: string;
  public mtime: number;

  constructor(source: IFileCacheSource, bus: IActor) {
    super(source, FileCacheItem.COLLECTION_NAME, bus);
  }

  save() {
    this.mtime = Date.now();
    return super.save();
  }

  serialize() {
    return {
      url: this.url,
      mtime: this.mtime,
      filePath: this.filePath,
    }
  }

  static async findByFilePath(filePath: string, bus: IActor) {
    const data = await DSFindAction.findOne(this.COLLECTION_NAME, { filePath: filePath }, bus);
    return data && new FileCacheItem(data, bus);
  }
}

@loggable()
export class ModuleImporter extends Observable implements IInvoker, IModuleResolveOptions {

  private _resolvedFiles: any;
  readonly bus: IActor;

  public extensions: string[];
  public directories: string[];

  private _modules: any;
  private _fileSystem: IFileSystem;
  private _fileWatchers: any;
  private _fileContentCache: any;
  readonly logger: Logger;

  constructor(private _sandbox: Sandbox, private _dependencies: Dependencies, private _getResolveOptions?: () => IModuleResolveOptions) {
    super();
    this.bus = MainBusDependency.getInstance(_dependencies);
    this._fileSystem = FileSystemDependency.getInstance(_dependencies);
    this.extensions = [];
    this.directories = [];
    this._fileWatchers     = {};
    this._resolvedFiles    = {};
    this._modules          = {};
    this._fileContentCache = {};
  }

  public getResolveOptions(): IModuleResolveOptions {
    const extensions = this.extensions.concat();
    const directories = this.directories.concat();

    extensions.push(...MimeTypeDependency.findAll(this._dependencies).map((dep) => "." + dep.fileExtension));

    if (this._getResolveOptions) {
      const extraRops = this._getResolveOptions();
      if (extraRops) {
        extensions.unshift(...extraRops.extensions);
        directories.unshift(...extraRops.directories);
      }
    }

    return {
      extensions: uniq(extensions),
      directories: uniq(directories)
    };
  }

  public async resolve(relativePath: string, cwd?: string) {
    return this._resolvedFiles[cwd + relativePath] || (this._resolvedFiles[cwd + relativePath] = new SingletonThenable(() => {
      const { extensions, directories } = this.getResolveOptions();
      try {
        return ResolveAction.execute(String(relativePath), cwd, extensions, directories, this.bus);
      } catch (e) {
        return null;
      }
    }));
  }

  /**
   * resets the importer -- executed by the main Sandbox object whenever a file changes.
   */

  public reset() {
    this._modules = {};
  }

  async load(envKind: string, relativePath: string, cwd?: string): Promise<IModule> {

    const filePath = await this.resolve(relativePath, cwd);

    if (filePath == null) {
      return new EmptyModule(filePath, {}, this._sandbox);
    }

    let fileCache: FileCacheItem = await FileCacheItem.findByFilePath(filePath, this.bus)

    if (!fileCache) {

      console.log("file://" + filePath);

      fileCache = new FileCacheItem({
        filePath: filePath,
        url: "file://" + filePath
      }, this.bus);

      await fileCache.save();
    }

    // readFile executed here to ensure that file watchers get added after resetting the importer
    // object
    const content      = await this.readUrl(fileCache.url);

    const moduleCache = this._modules[filePath] || (this._modules[filePath] = {});

    let module = moduleCache[envKind];

    if (!moduleCache[envKind]) {
      const moduleFactory = SandboxModuleFactoryDependency.find(envKind, MimeTypeDependency.lookup(filePath, this._dependencies), this._dependencies);
      if (!moduleFactory) {
        throw new Error(`Unable to find sandbox module for file ${envKind}:${filePath}`);
      }

      const module = moduleCache[envKind] = moduleFactory.create(filePath, content, this._sandbox);
      await module.load();
      module.observe(new WrapBus(this.onModuleAction.bind(this)));
    }

    return moduleCache[envKind];
  }

  async import(envKind: string, relativePath: string, cwd?: string) {
    return (await this.load(envKind, relativePath, cwd)).evaluate();
  }

  public async readFile(filePath: string): Promise<string> {
    const content = await this._fileContentCache[filePath] || (this._fileContentCache[filePath] = new SingletonThenable(async () => {
      return await this._fileSystem.readFile(filePath);
    }));

    this.watchFile(filePath);

    return content;
  }

  public async readUrl(url: string): Promise<string> {
    if (/^file:\/\//.test(url)) {
      return await this.readFile(url.substr("file://".length));
    } else {
      const response = await fetch(url);
      return await response.text();
    }
  }

  public watchFile(filePath: string) {
    if (!this._fileWatchers[filePath]) {
      this._fileWatchers[filePath] = this._fileSystem.watchFile(filePath, this.onFileChange.bind(this, filePath));
    }
  }

  protected async onFileChange(fileName: string) {

    this._fileContentCache[fileName] = null;

    this.notify(new ModuleImporterAction(ModuleImporterAction.MODULE_CONTENT_CHANGED));
  }

  protected async onModuleEdited(module: IModule, newContent: string) {

    if (this._fileContentCache[module.fileName]) {
      this._fileContentCache[module.fileName] = newContent;
    }

    const fileCache = await FileCacheItem.findByFilePath(module.fileName, this.bus);
    fileCache.url = "data:text/plain," + encodeURIComponent(newContent);
    await fileCache.save();

  }

  protected onModuleAction(action: Action) {
    if (action.type === SandboxModuleAction.EDITED) {
      this.onModuleEdited(action.target, action.target.content);
    }
    this.notify(action);
  }
}
