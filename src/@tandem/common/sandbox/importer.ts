import { IModule } from "./module";
import { Sandbox } from "./sandbox";
import { ModuleFactoryDependency } from "./dependencies";
import {
  IActor,
  Dependencies,
  ReadFileAction,
  WatchFileAction,
  MainBusDependency,
  SingletonThenable,
  MimeTypeDependency,
} from "@tandem/common";

export class ModuleImporter {

  private _cache: any;
  private _bus: IActor;
  private _modules: any;
  private _fileContentCache: any;

  constructor(private _sandbox: Sandbox, private _dependencies: Dependencies) {
    this._bus = MainBusDependency.getInstance(_dependencies);
    this._cache = {};
    this._modules = {};
    this._fileContentCache = {};
  }

  async resolve(filePath: string, relativePath?: string) {
    return filePath;
  }

  async import(envKind: string, filePath: string, relativePath?: string) {

    const resolvedPath = await this.resolve(filePath, relativePath);

    const key = envKind + resolvedPath;

    return this._cache[key] || this._modules[key] || (this._modules[key] = new SingletonThenable(async () => {
      const content = await this.readFile(resolvedPath);
      const moduleFactory = ModuleFactoryDependency.find(envKind, MimeTypeDependency.lookup(resolvedPath, this._dependencies), this._dependencies);
      const module = moduleFactory.create(resolvedPath, content, this);
      return this._cache[key] = await module.evaluate();
    }));
  }

  private async readFile(filePath: string): Promise<string> {
    return this._cache[filePath] || this._fileContentCache[filePath] || (this._fileContentCache[filePath] = new SingletonThenable(async () => {
      return this._cache[filePath] = (await ReadFileAction.execute(filePath, this._bus)).content;
    }));
  }
}