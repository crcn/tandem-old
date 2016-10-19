import { ISynthetic } from "./synthetic";
import { IFileResolverOptions } from "./resolver";
import { Action, IASTNode2, IActor } from "@tandem/common";

export class Sandbox2Action extends Action {
  static readonly EVALUATED = "sandbox2Evaluated";
}

export class BundleAction extends Action {
  static readonly BUNDLE_READY = "bundleReady";
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