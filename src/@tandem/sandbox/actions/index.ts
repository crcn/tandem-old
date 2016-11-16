import { IContentEdit } from "../edit";
import { IFileResolverOptions } from "../resolver";
import { IReadFileResultItem } from "@tandem/sandbox/file-system";
import {
  Action,
  IASTNode,
  serialize,
  deserialize,
  IDisposable,
  definePublicAction,
  defineMasterAction,
  defineWorkerAction,
} from "@tandem/common";
import { 
  IDispatcher,
  IStreamableDispatcher,
  readAllChunks,
  readOneChunk,
  ReadableStream,
  WritableStream,
} from "@tandem/mesh";
import { EditAction } from "../edit";
import * as atob from "atob";

// TODO - ability to trace where actions go in the application - possibly
// with a @trace(), or @log() feature

export class SandboxAction extends Action {
  static readonly EVALUATED = "sandboxEvaluated";
}

export class FileEditorAction extends Action {
  static readonly DEPENDENCY_EDITED = "dependencyEdited";
}

@definePublicAction({
  serialize({ actions }: ApplyFileEditAction) {
    return {
      actions: actions.map(serialize)
    }
  },
  deserialize({ actions }, injector) {
    return new ApplyFileEditAction(actions.map(action => deserialize(action, injector)));
  }
})
export class ApplyFileEditAction extends Action {
  static readonly APPLY_EDITS = "applyEditActions";
  constructor(readonly actions: EditAction[]) {
    super(ApplyFileEditAction.APPLY_EDITS);
  }
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

  static async dispatch(filePath: string, bus: IStreamableDispatcher<any>): Promise<Buffer> {
    return atob((await readOneChunk(bus.dispatch(new ReadFileAction(filePath)))).value);
  }
}

@definePublicAction()
export class ReadDirectoryAction extends Action {
  static readonly READ_DIRECTORY = "readDirectory";
  constructor(readonly directoryPath: string) {
    super(ReadDirectoryAction.READ_DIRECTORY);
  }

  static dispatch(directoryPath: string, bus: IStreamableDispatcher<any>): ReadableStream<IReadFileResultItem[]> {
    return bus.dispatch(new ReadDirectoryAction(directoryPath)).readable;
  }
}

@definePublicAction()
export class WatchFileAction extends Action {
  static readonly WATCH_FILE = "watchFile";
  constructor(readonly filePath: string) {
    super(WatchFileAction.WATCH_FILE);
  }

  static dispatch(filePath: string, bus: IStreamableDispatcher<any>, onFileChange: () => any): IDisposable {
    const { readable } = bus.dispatch(new WatchFileAction(filePath));
    readable.pipeTo(new WritableStream({
      write: onFileChange
    }));

    return {
      dispose: () => readable.cancel(undefined)
    };
  }
}