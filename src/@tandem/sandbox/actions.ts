import { ISynthetic } from "./synthetic";
import { IFileResolverOptions } from "./resolver";
import { Action, IASTNode2, IActor, definePublicAction, defineMasterAction, defineWorkerAction, IDisposable } from "@tandem/common";

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

@definePublicAction()
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

@definePublicAction()
export class ReadFileAction extends Action {
  static readonly READ_FILE = "readFile";
  constructor(readonly path: string) {
    super(ReadFileAction.READ_FILE);
  }

  static async execute(path: string, bus: IActor): Promise<string> {
    return (await bus.execute(new ReadFileAction(path)).read()).value;
  }
}

@definePublicAction()
export class WatchFileAction extends Action {
  static readonly WATCH_FILE = "watchFile";
  constructor(readonly path: string) {
    super(WatchFileAction.WATCH_FILE);
  }

  static execute(path: string, bus: IActor, onFileChange: () => any): IDisposable {
    const stream = bus.execute(new WatchFileAction(path));

    stream.pipeTo({
      abort: () => {},
      close: () => {},
      write: onFileChange
    });

    return {
      dispose: () => stream.cancel()
    };
  }
}

