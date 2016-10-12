import { IModule } from "./module";
import { Sandbox } from "./sandbox";
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

@loggable()
export class ModuleImporter extends Observable implements IInvoker, IModuleResolveOptions {

  private _resolvedFiles: any;
  readonly bus: IActor;

  public extensions: string[];
  public directories: string[];

  private _modules: any;
  private _imports: any;
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
    this._imports          = {};
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
        extensions.push(...extraRops.extensions);
        directories.push(...extraRops.directories);
      }
    }

    return {
      extensions: uniq(directories),
      directories: uniq(directories)
    };
  }

  public async resolve(filePath: string, relativePath?: string) {
    return this._resolvedFiles[filePath] || (this._resolvedFiles[filePath] = new SingletonThenable(() => {
      const { extensions, directories } = this.getResolveOptions();
      return ResolveAction.execute(String(filePath), relativePath, extensions, directories, this.bus);
    }));
  }

  /**
   * resets the importer -- executed by the main Sandbox object whenever a file changes.
   */

  public reset() {
    // clear all imports to ensure that all modules get re-evaluated. Important
    // in case any module accesses global variables such as the DOM
    this._imports = {};
  }

  async import(envKind: string, filePath: string, relativePath?: string) {

    const resolvedPath = await this.resolve(filePath, relativePath);

    // readFile executed here to ensure that file watchers get added after resetting the importer
    // object
    const content      = await this.readFile(resolvedPath);

    const moduleCache = this._modules[resolvedPath] || (this._modules[resolvedPath] = {});

    if (!moduleCache[envKind]) {
      const moduleFactory = SandboxModuleFactoryDependency.find(envKind, MimeTypeDependency.lookup(resolvedPath, this._dependencies), this._dependencies);
      const module = moduleCache[envKind] = moduleFactory.create(resolvedPath, content, this._sandbox);
      module.observe(new WrapBus(this.onModuleAction.bind(this)));
      watchProperty(module, "content", this.onModuleContentChange.bind(this, module));
    }

    const module: IModule = moduleCache[envKind];

    const importsKey = envKind + resolvedPath;

    if (!this._imports[importsKey]) {
      this._imports[importsKey] = await module.evaluate();
    }

    return this._imports[importsKey];
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

  protected onFileChange(data: IReadFileActionResponseData) {

    if (this._fileContentCache[data.path]) {
      this._fileContentCache[data.path] = data.content;
    }

    // bust all modules for the given path to ensure that it gets re-evaluated
    this._modules[data.path] = undefined;
    this.notify(new ModuleImporterAction(ModuleImporterAction.MODULE_CONTENT_CHANGED));
  }

  protected onModuleContentChange(module: IModule, newContent: string, oldContent: string) {

    if (this._fileContentCache[module.fileName]) {
      this._fileContentCache[module.fileName] = newContent;
    }

    UpdateTemporaryFileContentAction.execute({ path: module.fileName, content: newContent }, this.bus);
  }

  protected onModuleAction(action: Action) {
    this.notify(action);
  }
}
