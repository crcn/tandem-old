import { IModule } from "./module";
import { Sandbox } from "./sandbox";
import { ModuleFactoryDependency } from "./dependencies";
import {
  IActor,
  Observable,
  Dependencies,
  ResolveAction,
  ChangeAction,
  ReadFileAction,
  WatchFileAction,
  MainBusDependency,
  SingletonThenable,
  loggable,
  IInvoker,
  Logger,
  MimeTypeDependency,
  IReadFileActionResponseData,
} from "@tandem/common";

@loggable()
export class ModuleImporter extends Observable implements IInvoker {

  private _resolvedFiles: any;
  readonly bus: IActor;
  private _modules: any;
  private _imports: any;
  private _fileWatchers: any;
  private _fileContentCache: any;
  readonly logger: Logger;

  constructor(private _sandbox: Sandbox, private _dependencies: Dependencies) {
    super();
    this.bus = MainBusDependency.getInstance(_dependencies);
    this._fileWatchers     = {};
    this._resolvedFiles    = {};
    this._imports          = {};
    this._modules          = {};
    this._fileContentCache = {};
  }

  public async resolve(filePath: string, relativePath?: string) {
    return this._resolvedFiles[filePath] || (this._resolvedFiles[filePath] = new SingletonThenable(() => {
      return ResolveAction.execute(String(filePath), relativePath, this.bus);
    }));
  }

  /**
   * resets the importer -- executed by the main Sandbox object whenever a file changes.
   */

  public reset() {

    // remove all file watchers to ensure that the importer is only watching
    // the files it needs to after re-evaluation.
    // for (const key in this._fileWatchers) {
    //   this._fileWatchers[key].dispose();
    //   delete this._fileWatchers[key];
    // }

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
      // this.logger.verbose("creating module: %s", filePath);
      const moduleFactory = ModuleFactoryDependency.find(envKind, MimeTypeDependency.lookup(resolvedPath, this._dependencies), this._dependencies);
      moduleCache[envKind] = moduleFactory.create(resolvedPath, content, this._sandbox);
    }

    const module: IModule = moduleCache[envKind];

    const importsKey = envKind + resolvedPath;

    if (!this._imports[importsKey]) {
      // this.logger.verbose("evaluating module: %s", filePath);
      this._imports[importsKey] = module.evaluate();
    }

    return this._imports[importsKey];
  }

  public async readFile(filePath: string): Promise<string> {
    const content = await this._fileContentCache[filePath] || (this._fileContentCache[filePath] = new SingletonThenable(async () => {
      return (await ReadFileAction.execute(filePath, this.bus)).content;
      // const response = await fetch(`/asset/${encodeURIComponent(filePath)}`);
      // return await response.text();
    }));

    this.watchFile(filePath);

    return content;
  }

  public watchFile(filePath: string) {
    if (!this._fileWatchers[filePath]) {
      // this.logger.verbose("watching %s", filePath);
      this._fileWatchers[filePath] = WatchFileAction.execute(filePath, this.bus, this.onFileChange.bind(this));
    }
  }

  protected onFileChange(data: IReadFileActionResponseData) {
    // this.logger.verbose("file change: %s", data.path);

    if (this._fileContentCache[data.path]) {
      this._fileContentCache[data.path] = data.content;
    }

    // bust all modules for the given path to ensure that it gets re-evaluated
    this._modules[data.path] = undefined;
    this.notify(new ChangeAction());
  }
}
