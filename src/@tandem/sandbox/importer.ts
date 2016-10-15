import { Sandbox } from "./sandbox";
import { IModule, BaseSandboxModule } from "./module";
import { SandboxModuleFactoryDependency } from "./dependencies";
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
  ResolveAction,
  ChangeAction,
  ReadFileAction,
  WatchFileAction,
  MainBusDependency,
  SingletonThenable,
  MimeTypeDependency,
  PropertyChangeAction,
  IReadFileActionResponseData,
  UpdateTemporaryFileContentAction,
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

@loggable()
export class ModuleImporter extends Observable implements IInvoker, IModuleResolveOptions {

  private _resolvedFiles: any;
  readonly bus: IActor;

  public extensions: string[];
  public directories: string[];

  private _modules: any;
  private _fileWatchers: any;
  private _fileContentCache: any;
  readonly logger: Logger;

  constructor(private _sandbox: Sandbox, private _dependencies: Dependencies, private _getResolveOptions?: () => IModuleResolveOptions) {
    super();
    this.bus = MainBusDependency.getInstance(_dependencies);
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

  public async resolve(filePath: string, relativePath?: string) {
    return this._resolvedFiles[relativePath + filePath] || (this._resolvedFiles[relativePath + filePath] = new SingletonThenable(() => {
      const { extensions, directories } = this.getResolveOptions();
      try {
        return ResolveAction.execute(String(filePath), relativePath, extensions, directories, this.bus);
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

  async load(envKind: string, filePath: string, relativePath?: string): Promise<IModule> {

    const resolvedPath = await this.resolve(filePath, relativePath);

    if (resolvedPath == null) {
      return new EmptyModule(filePath, {}, this._sandbox);
    }

    // TODO - add missintModule if no resolution

    // readFile executed here to ensure that file watchers get added after resetting the importer
    // object
    const content      = await this.readFile(resolvedPath);

    const moduleCache = this._modules[resolvedPath] || (this._modules[resolvedPath] = {});

    let module = moduleCache[envKind];

    if (!moduleCache[envKind]) {
      const moduleFactory = SandboxModuleFactoryDependency.find(envKind, MimeTypeDependency.lookup(resolvedPath, this._dependencies), this._dependencies);
      if (!moduleFactory) {
        throw new Error(`Unable to find sandbox module for file ${envKind}:${resolvedPath}`);
      }

      const module = moduleCache[envKind] = moduleFactory.create(resolvedPath, content, this._sandbox);
      await module.load();
      module.observe(new WrapBus(this.onModuleAction.bind(this)));
    }

    return moduleCache[envKind];
  }

  async import(envKind: string, filePath: string, relativePath?: string) {
    return (await this.load(envKind, filePath, relativePath)).evaluate();
  }

  public async readFile(filePath: string): Promise<string> {
    const content = await this._fileContentCache[filePath] || (this._fileContentCache[filePath] = new SingletonThenable(async () => {
      return (await ReadFileAction.execute(filePath, this.bus)).content;
    }));

    this.watchFile(filePath);

    return content;
  }

  public watchFile(filePath: string) {
    if (!this._fileWatchers[filePath]) {
      this._fileWatchers[filePath] = WatchFileAction.execute(filePath, this.bus, this.onFileChange.bind(this));
    }
  }

  protected async onFileChange(data: IReadFileActionResponseData) {

    if (this._fileContentCache[data.path]) {
      this._fileContentCache[data.path] = data.content;
    }

    this.notify(new ModuleImporterAction(ModuleImporterAction.MODULE_CONTENT_CHANGED));
  }

  protected onModuleEdited(module: IModule, newContent: string) {

    if (this._fileContentCache[module.fileName]) {
      this._fileContentCache[module.fileName] = newContent;
    }

    UpdateTemporaryFileContentAction.execute({ path: module.fileName, content: newContent }, this.bus);
  }

  protected onModuleAction(action: Action) {
    if (action.type === SandboxModuleAction.EDITED) {
      this.onModuleEdited(action.target, action.target.content);
    }
    this.notify(action);
  }
}
