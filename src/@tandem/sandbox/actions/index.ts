import { IContentEdit } from "../edit";
import { IFileResolverOptions } from "../resolver";
import { IReadFileResultItem } from "@tandem/sandbox/file-system";

import {
  Action,
  IASTNode,
  serialize,
  deserialize,
  IDisposable,
  serializable
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

// TODO - ability to trace where actions go in the application - possibly
// with a @trace(), or @log() feature

export class SandboxAction extends Action {
  static readonly EVALUATED = "sandboxEvaluated";
}

export class FileEditorAction extends Action {
  static readonly DEPENDENCY_EDITED = "dependencyEdited";
}

@serializable({
  serialize({ actions }: ApplyFileEditRequest) {
    return {
      actions: actions.map(serialize)
    }
  },
  deserialize({ actions }, injector) {
    return new ApplyFileEditRequest(actions.map(action => deserialize(action, injector)));
  }
})
export class ApplyFileEditRequest extends Action {
  static readonly APPLY_EDITS = "applyEditActions";
  constructor(readonly actions: EditAction[]) {
    super(ApplyFileEditRequest.APPLY_EDITS);
  }
}

export class ModuleImporterAction extends Action {
  static readonly MODULE_CONTENT_CHANGED = "moduleContentChanged";
}

export class SandboxModuleAction extends Action {
  static readonly EVALUATING = "evaluating";
  static readonly EDITED = "edited";
}

@serializable()
export class ResolveFileRequest extends Action {
  static readonly RESOLVE_FILE = "resolveFile";
  constructor(readonly relativePath: string, readonly cwd?: string, readonly options?: IFileResolverOptions) {
    super(ResolveFileRequest.RESOLVE_FILE);
  }
}

export class FileCacheAction extends Action {
  static readonly ADDED_ENTITY = "addedEntity";
  constructor(type: string, readonly item?: any) {
    super(type);
  }
}

@serializable()
export class ReadFileRequest extends Action {
  static readonly READ_FILE = "readFile";
  constructor(readonly filePath: string) {
    super(ReadFileRequest.READ_FILE);
  }

  static async dispatch(filePath: string, bus: IStreamableDispatcher<any>): Promise<Buffer> {
    return new Buffer((await readOneChunk(bus.dispatch(new ReadFileRequest(filePath)))).value, "base64");
  }
}

@serializable()
export class ReadDirectoryRequest extends Action {
  static readonly READ_DIRECTORY = "readDirectory";
  constructor(readonly directoryPath: string) {
    super(ReadDirectoryRequest.READ_DIRECTORY);
  }

  static dispatch(directoryPath: string, bus: IStreamableDispatcher<any>): ReadableStream<IReadFileResultItem[]> {
    return bus.dispatch(new ReadDirectoryRequest(directoryPath)).readable;
  }
}

@serializable()
export class WatchFileRequest extends Action {
  static readonly WATCH_FILE = "watchFile";
  constructor(readonly filePath: string) {
    super(WatchFileRequest.WATCH_FILE);
  }

  static dispatch(filePath: string, bus: IStreamableDispatcher<any>, onFileChange: () => any): IDisposable {
    const { readable } = bus.dispatch(new WatchFileRequest(filePath));
    readable.pipeTo(new WritableStream({
      write: onFileChange
    }));

    return {
      dispose: () => readable.cancel(undefined)
    };
  }
}