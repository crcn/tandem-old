import { ISynthetic } from "./synthetic";
import { IFileResolverOptions } from "./resolver";
import { Action, IASTNode2, IActor } from "@tandem/common";

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

export class ResolveFileAction extends Action {
  static readonly RESOLVE_FILE = "resolveFile";
  constructor(readonly relativePath: string, readonly cwd?: string, readonly options?: IFileResolverOptions) {
    super(ResolveFileAction.RESOLVE_FILE);
  }
}

export class FileCacheAction extends Action {
  static readonly ADDED_ENTITY = "addedEntity";
  constructor(type: string, readonly item?: any) {
    super(type);
  }
}