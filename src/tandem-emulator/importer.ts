import { IModule } from "./module";
import { WrapBus } from "mesh";
import { IFileSystem } from "./file-system";
import { IEnvironment } from "./environment";
import { ModuleFactoryDependency } from "./dependencies";
import { Dependencies, MimeTypeDependency, Observable, Action } from "tandem-common";

export class ModuleImporter {
  private _moduleLoaders: {};

  constructor(private _environmentKind: number, private readonly  _fileSystem: IFileSystem, private _dependencies: Dependencies) { }

  async importModule(path: string, mimeType?: string): Promise<IModule> {
    if (this._moduleLoaders[path]) return await this._moduleLoaders[path].load();
    const factory = ModuleFactoryDependency.find(this._environmentKind, mimeType || MimeTypeDependency.lookup(path, this._dependencies), this._dependencies);
    this._moduleLoaders[path] = new ModuleLoader(this._fileSystem, path, factory);
    return this.importModule(path, mimeType);
  }
}

class ModuleLoader extends Observable {
  private _module: IModule;
  private _loading: boolean;

  constructor(private _fileSystem: IFileSystem, private _path: string, private _moduleFactory: ModuleFactoryDependency) {
    super();
  }

  get module(): IModule {
    return this._module;
  }

  async load(): Promise<IModule> {

    if (this._module) {
      return this._module;
    }

    if (this._loading) {
      return new Promise<IModule>((resolve, reject) => {

        const observer = new WrapBus((action) => {
          if (action.type !== "loaded") return;
          this.unobserve(observer);
          resolve(this._module);
        });

        this.observe(observer);
      });
    }
    this._loading = true;
    const { content } = await this._fileSystem.readFile(this._path);
    this._module = this._moduleFactory.create(content);

    // TODO
    // this._module.evaluate()
    this._loading = false;
    this.notify(new Action("loaded"));
  }
}