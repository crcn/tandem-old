import { Action, IASTNode2 } from "@tandem/common";
import { ISynthetic } from "./synthetic";

export class SandboxAction extends Action {
  static readonly OPENED_MAIN_ENTRY = "openedMainEntry";
  static readonly OPENING_MAIN_ENTRY = "openingMainEntry";
}

export class ModuleImporterAction extends Action {
  static readonly MODULE_CONTENT_CHANGED = "moduleContentChanged";
}

export class SandboxModuleAction extends Action {
  static readonly EVALUATING = "evaluating";
  static readonly EDITED = "edited";
}
