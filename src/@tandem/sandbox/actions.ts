import { IContentEdit } from "./editor";
import { IFileResolverOptions } from "./resolver";
import { Action, IASTNode, IActor, definePublicAction, defineMasterAction, defineWorkerAction, IDisposable } from "@tandem/common";

// TODO - ability to trace where actions go in the application - possibly
// with a @trace(), or @log() feature

export class SandboxAction extends Action {
  static readonly EVALUATED = "sandboxEvaluated";
}

export class FileEditorAction extends Action {
  static readonly DEPENDENCY_EDITED = "dependencyEdited";
}

export class ApplyEditAction extends Action {
  static readonly APPLY_EDITS = "applyEditActions";
  constructor(readonly edit: IContentEdit) {
    super(ApplyEditAction.APPLY_EDITS);
  }
}

export class DependencyAction extends Action {
  static readonly DEPENDENCY_READY = "dependencyReady";
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
  constructor(readonly filePath: string) {
    super(ReadFileAction.READ_FILE);
  }

  static async execute(filePath: string, bus: IActor): Promise<string> {
    return (await bus.execute(new ReadFileAction(filePath)).read()).value;
  }
}

@definePublicAction()
export class WatchFileAction extends Action {
  static readonly WATCH_FILE = "watchFile";
  constructor(readonly filePath: string) {
    super(WatchFileAction.WATCH_FILE);
  }

  static execute(filePath: string, bus: IActor, onFileChange: () => any): IDisposable {
    const stream = bus.execute(new WatchFileAction(filePath));

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

