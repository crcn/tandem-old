import { IModule } from "./module";
import { WrapBus } from "mesh";
import { IFileSystem } from "./file-system";
import { SymbolTable } from "./synthetic";
import { ModuleImporterAction } from "./actions";

import {
  ModuleFactoryDependency,
  ModuleShimFactoryDependency
} from "./dependencies";

import {
  Action,
  Observable,
  IDisposable,
  ResolveAction,
  Dependencies,
  SingletonThenable,
  MimeTypeDependency,
  MainBusDependency,
} from "@tandem/common";

import {
  ISynthetic,
  NativeFunction,
  SyntheticObject,
  SyntheticValueObject,
} from "./synthetic";

import {
  EnvironmentKind
} from "./environment";

import * as path from "path";

export class ModuleImporter extends Observable implements IDisposable {
  private _modules: any;
  private _fileWatchers: Array<IDisposable> = [];
  private _resolvedPaths: any;
  public context: SymbolTable;

  constructor(private readonly  _fileSystem: IFileSystem, private _dependencies: Dependencies) {
    super();
    this._resolvedPaths = {};
    this._modules = {};
  }

  async resolve(filePath: string, relativePath?: string) {
    return this._resolvedPaths[filePath] || (this._resolvedPaths[filePath] = await ResolveAction.execute(filePath, relativePath, MainBusDependency.getInstance(this._dependencies)));
  }

  /**
   * includes a module from the file system
   */

  async require(envKind: EnvironmentKind, filePath: string, mimeType?: string, relativePath?: string): Promise<any> {

    // necessary for cases where we don't want a module to be loaded in, such as react
    const shimFactroy = ModuleShimFactoryDependency.find(envKind, filePath, this._dependencies);

    filePath = await this.resolve(filePath, relativePath);
    console.log(filePath);

    return this._modules[envKind + filePath] || (this._modules[envKind + filePath] = new SingletonThenable(async () => {

      if (shimFactroy) {
        return await shimFactroy.create();
      }

      const factory = ModuleFactoryDependency.find(envKind, mimeType || MimeTypeDependency.lookup(filePath, this._dependencies), this._dependencies);

      const fileWatcher = this._fileSystem.watchFile(filePath, () => {
        this._fileWatchers.splice(this._fileWatchers.indexOf(fileWatcher), 1);
        this._modules[envKind + filePath] = undefined;
        fileWatcher.dispose();
        this.notify(new ModuleImporterAction(ModuleImporterAction.IMPORTED_MODULE_FILE_CHANGE));
      });

      this._fileWatchers.push(fileWatcher);

      const context = this.context.createChild();
      context.set("import", new NativeFunction(async (envKind: EnvironmentKind, reqPath: string) => {
        return this.require(envKind, reqPath, undefined, filePath);
      }));

      // make thie importer accessible
      context.set("__importer", new SyntheticValueObject(this));
      context.set("__filename", new SyntheticValueObject(filePath));
      context.set("__dirname", new SyntheticValueObject(path.dirname(filePath)));
      context.set("exports", new SyntheticObject());

      console.log(context);
      context.set("module", new SyntheticObject({
        exports: context.get("exports")
      }));

      await factory.create(filePath, (await this._fileSystem.readFile(filePath)).content).evaluate(context);

      return context.get("module").get("exports");
    }));
  }

  dispose() {
    for (const fileWatcher of this._fileWatchers) {
      fileWatcher.dispose();
    }
  }
}
