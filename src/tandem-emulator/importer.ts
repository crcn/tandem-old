import { IModule } from "./module";
import { WrapBus } from "mesh";
import { IFileSystem } from "./file-system";
import { SymbolTable } from "./synthetic";
import { ModuleImporterAction } from "./actions";
import { ModuleFactoryDependency } from "./dependencies";
import {
  Action,
  Observable,
  IDisposable,
  Dependencies,
  SingletonThenable,
  MimeTypeDependency,
} from "tandem-common";

import {
  NativeFunction,
  SyntheticValueObject
} from "./synthetic";

import * as path from "path";

export class ModuleImporter extends Observable implements IDisposable {
  private _modules: any;
  private _fileWatchers: Array<IDisposable> = [];

  constructor(private readonly  _fileSystem: IFileSystem, private _dependencies: Dependencies, private _context: SymbolTable) {
    super();
    this._modules = {};
  }

  resolve(filePath: string, relativePath?: string) {

    // TODO - check module directories here
    if (relativePath && filePath.charAt(0) !== "/") {
      filePath = path.join(path.dirname(relativePath), filePath);
    }

    return filePath;
  }

  require(envKind: number, filePath: string, mimeType?: string, relativePath?: string): Promise<any> {

    filePath = this.resolve(filePath);

    return this._modules[envKind + filePath] || (this._modules[envKind + filePath] = new SingletonThenable(async () => {
      const factory = ModuleFactoryDependency.find(envKind, mimeType || MimeTypeDependency.lookup(filePath, this._dependencies), this._dependencies);

      const fileWatcher = this._fileSystem.watchFile(filePath, () => {
        this._fileWatchers.splice(this._fileWatchers.indexOf(fileWatcher), 1);
        fileWatcher.dispose();
        this.notify(new ModuleImporterAction(ModuleImporterAction.IMPORTED_MODULE_FILE_CHANGE));
      });

      this._fileWatchers.push(fileWatcher);

      const context = this._context.createChild();
      context.set("require", new NativeFunction(async (reqPath: string) => {
        return this.require(envKind, reqPath, undefined, filePath);
      }));

      // make thie importer accessible
      context.set("__importer", new SyntheticValueObject(this));
      context.set("__filename", new SyntheticValueObject(filePath));
      context.set("__dirname", new SyntheticValueObject(path.dirname(filePath)));

      return await factory.create(filePath, (await this._fileSystem.readFile(filePath)).content).evaluate(context);
    }));
  }

  dispose() {
    for (const fileWatcher of this._fileWatchers) {
      fileWatcher.dispose();
    }
  }
}
