import { IModule } from "./module";
import { FileCache } from "./file-cache";
import { IFileResolver } from "./resolver";
import { ModuleImporter, IModuleResolveOptions } from "./importer";
import { FileResolverDependency, FileCacheDependency } from "./dependencies";
import {
  Action,
  Observable,
  TypeWrapBus,
  Dependencies,
  ChangeAction,
  PropertyChangeAction,
} from "@tandem/common";

import {

  SandboxModuleAction,
  ModuleImporterAction,
} from "./actions";


import { WrapBus } from "mesh";
interface ISandboxEntry {
  envMimeType: string;
  filePath: string;
}

export class Sandbox extends Observable {

  private _entry: ISandboxEntry;
  private _global: any;
  private _importer: ModuleImporter;
  private _shouldResetAgain: boolean;
  private _mainExports: any;
  private _reloading: boolean;
  private _fileCache: FileCache;
  private _resolver: IFileResolver;
  private _shouldReloadAgain: boolean;

  constructor(private _dependencies: Dependencies, private createGlobal: () => any = () => {}, getResolveOptions?: () => IModuleResolveOptions) {
    super();
    this._resolver = FileResolverDependency.getInstance(_dependencies);
    this._fileCache = FileCacheDependency.getInstance(_dependencies);
    this._importer = new ModuleImporter(this, _dependencies, getResolveOptions);
    this._importer.observe(new WrapBus(this.onImporterAction.bind(this)));
  }

  get fileCache(): FileCache {
    return this._fileCache;
  }

  get fileResolver(): IFileResolver {
    return this._resolver;
  }

  get global(): any {
    return this._global || (this._global = this.createGlobal());
  }

  get importer(): ModuleImporter {
    return this._importer;
  }

  get mainExports(): any {
    return this._mainExports;
  }

  async open(envMimeType: string, filePath: string, relativePath?: string) {
    this._importer.reset();

    if (this._global) {
      // TODO - check if disposable
      this._global = undefined;
    }

    this._entry = { envMimeType: envMimeType, filePath: filePath };
    // this.notify(new SandboxAction(SandboxAction.OPENING_MAIN_ENTRY));
    this._mainExports = await this._importer.import(envMimeType, filePath, relativePath);
    // this.notify(new SandboxAction(SandboxAction.OPENED_MAIN_ENTRY));
  }

  protected onImporterAction(action: Action) {
    if (action.type === ModuleImporterAction.MODULE_CONTENT_CHANGED) {
      this.reload();
    }
    this.notify(action);
  }

  public async reload() {
    if (this._reloading) {
      this._shouldReloadAgain = true;
      return;
    }
    this._reloading = true;

    // parsing errors may occur -- catch them to ensure
    // that they don't prohibit reload() from running next time
    try {
      if (this._entry) {
        await this.open(this._entry.envMimeType, this._entry.filePath);
      }
    } catch (e) {
      console.error(e);
    }

    this._reloading = false;
    if (this._shouldReloadAgain) {
      this._shouldReloadAgain = false;
      await this.reload();
    }
  }
}