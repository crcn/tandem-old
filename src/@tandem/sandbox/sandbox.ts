import { IModule } from "./module";
import { ModuleImporter } from "./importer";
import {
  Action,
  Observable,
  TypeWrapBus,
  Dependencies,
  ChangeAction,
  PropertyChangeAction,
} from "@tandem/common";

import {
  SandboxAction,
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
  private _shouldReloadAgain: boolean;
  private _currentModule: IModule;

  constructor(private _dependencies: Dependencies, private createGlobal: () => any = () => {}) {
    super();
    this._importer = new ModuleImporter(this, _dependencies);
    this._importer.observe(new WrapBus(this.onImporterAction.bind(this)));
  }

  get global(): any {
    return this._global || (this._global = this.createGlobal());
  }

  get currentModule(): IModule {
    return this._currentModule;
  }

  get importer(): ModuleImporter {
    return this._importer;
  }

  get mainExports(): any {
    return this._mainExports;
  }

  async open(envMimeType: string, filePath: string, relativePath?: string) {
    this._entry = { envMimeType: envMimeType, filePath: filePath };
    this._mainExports = await this._importer.import(envMimeType, filePath, relativePath);
    this.notify(new SandboxAction(SandboxAction.OPENED_MAIN_ENTRY));
  }

  protected onImporterAction(action: Action) {
    if (action.type === ModuleImporterAction.MODULE_CONTENT_CHANGED) {
      this.reload();
    } else if (action.type === SandboxModuleAction.EVALUATING) {
      const currentModule = this._currentModule;
      this._currentModule = action.target;
      this.notify(new PropertyChangeAction("currentModule", this._currentModule, currentModule));
    }
    this.notify(action);
  }

  public async reload() {
    if (this._reloading) {
      this._shouldReloadAgain = true;
      return;
    }
    this._reloading = true;

    this._importer.reset();
    this._global = undefined;

    if (this._entry) {
      await this.open(this._entry.envMimeType, this._entry.filePath);
    }
    this._reloading = false;
    if (this._shouldReloadAgain) {
      this._shouldReloadAgain = false;
      await this.reload();
    }
  }
}