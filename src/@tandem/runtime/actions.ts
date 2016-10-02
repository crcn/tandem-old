import { Action } from "@tandem/common";

export class SyntheticNodeAction extends Action {
  static readonly NODE_ADDED   = "nodeAdded";
  static readonly NODE_REMOVED = "nodeRemoved";
}

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