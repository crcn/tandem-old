import { ModuleImporter } from "./importer";
import {
  Observable,
  TypeWrapBus,
  Dependencies,
  ChangeAction,
} from "@tandem/common";

interface ISandboxEntry {
  envMimeType: string;
  filePath: string;
}

export class Sandbox extends Observable {

  private _shouldResetAgain: boolean;
  private _importer: ModuleImporter;
  private _entry: ISandboxEntry;
  private _globals: any;

  constructor(private _dependencies: Dependencies, private createGlobals: () => any = () => {}) {
    super();
    this._importer = new ModuleImporter(this, _dependencies);
    this._importer.observe(new TypeWrapBus(ChangeAction.CHANGE, this.onImporterChange.bind(this)));
  }

  get globals(): any {
    return this._globals || (this._globals = this.createGlobals());
  }

  get importer(): ModuleImporter {
    return this._importer;
  }

  async open(envMimeType: string, filePath: string, relativePath?: string) {
    this._entry = { envMimeType: envMimeType, filePath: filePath };
    return await this._importer.import(envMimeType, filePath, relativePath);
  }

  protected onImporterChange(action: ChangeAction) {
    this.reset();
    this.notify(action);
  }

  protected async reset() {
    this._importer.reset();
    this._globals = undefined;
    if (this._entry) {
      await this.open(this._entry.envMimeType, this._entry.filePath);
    }
  }
}