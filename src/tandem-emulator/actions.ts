import { Action } from "tandem-common";

export class ModuleImporterAction extends Action {
  static readonly IMPORTED_MODULE_FILE_CHANGE = "importedModuleFileChange";
  constructor(type: string) {
    super(type);
  }
}

export class SyntheticAction extends Action {
  static readonly PATCHED = "patched";
  constructor(type: string) {
    super(type);
  }
}