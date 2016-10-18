import { Sandbox } from "./sandbox";
import { FileCache } from "./file-cache";
import { IFileSystem } from "./file-system";
import { FileSystemDependency } from "./dependencies";
import { IModule, BaseSandboxModule } from "./module";
import { SandboxModuleFactoryDependency, FileResolverDependency, FileCacheDependency } from "./dependencies";
import { uniq } from "lodash";
import {
  Logger,
  IActor,
  Action,
  loggable,
  IInvoker,
  Observable,
  Dependencies,
  watchProperty,
  ChangeAction,
  BaseActiveRecord,
  MainBusDependency,
  SingletonThenable,
  MimeTypeDependency,
  PropertyChangeAction,
} from "@tandem/common";

import { IFileResolver } from "./resolver";

import {
  ResolveFileAction,
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
  constructor(filePath: string, exports: any, sandbox: Sandbox) {
    super(filePath, null, sandbox);
  }
  load() { }
  evaluate() { return {}; }
}

interface IFileCacheSource {
  filePath: string;
  url?: string;
  mtime?: number;
}

@loggable()
export class ModuleImporter extends Observable implements IInvoker, IModuleResolveOptions {

  readonly bus: IActor;

  public extensions: string[];
  public directories: string[];

  private _modules: any;
  private _fileSystem: IFileSystem;
  private _fileWatchers: any;
  private _fileContentCache: any;
  private _fileResolver: IFileResolver;
  private _fileCache: FileCache;
  readonly logger: Logger;

  constructor(private _sandbox: Sandbox, private _dependencies: Dependencies, private _getResolveOptions?: () => IModuleResolveOptions) {
    super();
    this.bus = MainBusDependency.getInstance(_dependencies);
    this._fileSystem = FileSystemDependency.getInstance(_dependencies);
    this._fileResolver = FileResolverDependency.getInstance(_dependencies);
    this._fileCache = FileCacheDependency.getInstance(this._dependencies);
    this.extensions = [];
    this.directories = [];
    this._fileWatchers     = {};
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

  public resolve(relativePath: string, cwd?: string) {
    return this._fileResolver.resolve(relativePath, cwd, this.getResolveOptions());
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

    const fileCache = await this._fileCache.item(filePath);

    // readFile executed here to ensure that file watchers get added after resetting the importer
    // object
    const content      = await fileCache.read();

    const moduleCache = this._modules[filePath] || (this._modules[filePath] = {});

    let module = moduleCache[envKind];

    if (!moduleCache[envKind]) {
      const moduleFactory = SandboxModuleFactoryDependency.find(envKind, MimeTypeDependency.lookup(filePath, this._dependencies), this._dependencies);
      if (!moduleFactory) {
        throw new Error(`Unable to find sandbox module for file ${envKind}:${filePath}`);
      }

      const module = moduleCache[envKind] = moduleFactory.create(filePath, content, this._sandbox);
      try {
        await module.load();
      } catch(e) {
        console.error(`Cannot load module ${filePath}`);
        throw e;
      }
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

  public watchFile(filePath: string) {
    if (!this._fileWatchers[filePath]) {
      this._fileWatchers[filePath] = this._fileSystem.watchFile(filePath, this.onFileChange.bind(this, filePath));
    }
  }

  protected async onFileChange(filePath: string) {
    this._fileContentCache[filePath] = null;
    this.notify(new ModuleImporterAction(ModuleImporterAction.MODULE_CONTENT_CHANGED));
  }

  protected async onModuleEdited(module: IModule, newContent: string) {

    if (this._fileContentCache[module.filePath]) {
      this._fileContentCache[module.filePath] = newContent;
    }

    const fileCache = await this._fileCache.item(module.filePath);
    await fileCache.setDataUrl(newContent).save();
  }

  protected onModuleAction(action: Action) {
    if (action.type === SandboxModuleAction.EDITED) {
      this.onModuleEdited(action.target, action.target.content);
    }
    this.notify(action);
  }
}
