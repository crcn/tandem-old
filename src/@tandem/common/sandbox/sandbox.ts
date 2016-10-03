import { Dependencies } from "@tandem/common";
import { ModuleImporter } from "./importer";

export class Sandbox {

  private _importer: ModuleImporter;

  constructor(private _dependencies: Dependencies) {
    this._importer = new ModuleImporter(this, _dependencies);
  }

  async import(envKind: string, filePath: string, relativePath?: string) {
    return await this._importer.import(envKind, filePath, relativePath);
  }
}