import { IContentEdit } from "../edit";
import { IFileResolverOptions } from "../resolver";
import { IReadFileResultItem } from "@tandem/sandbox/file-system";

import {
  IASTNode,
  serialize,
  deserialize,
  IDisposable,
  Mutation,
  serializable
} from "@tandem/common";

import { 
  Message,
  IDispatcher,
  IStreamableDispatcher,
  readAllChunks,
  readOneChunk,
  ReadableStream,
  WritableStream,
} from "@tandem/mesh";


@serializable({
  serialize({ mutations }: ApplyFileEditRequest) {
    return {
      mutations: mutations.map(serialize)
    }
  },
  deserialize({ mutations }, injector) {
    return new ApplyFileEditRequest(mutations.map(action => deserialize(action, injector)));
  }
})
export class ApplyFileEditRequest extends Message {
  static readonly APPLY_EDITS = "applyMutations";
  constructor(readonly mutations: Mutation<any>[], readonly saveFile: boolean = false) {
    super(ApplyFileEditRequest.APPLY_EDITS);
  }
}

export class ModuleImporterAction extends Message {
  static readonly MODULE_CONTENT_CHANGED = "moduleContentChanged";
}

export class SandboxModuleAction extends Message {
  static readonly EVALUATING = "evaluating";
  static readonly EDITED = "edited";
}

@serializable()
export class ResolveFileRequest extends Message {
  static readonly RESOLVE_FILE = "resolveFile";
  constructor(readonly relativePath: string, readonly cwd?: string, readonly options?: IFileResolverOptions) {
    super(ResolveFileRequest.RESOLVE_FILE);
  }
}

export class FileCacheAction extends Message {
  static readonly ADDED_ENTITY = "addedEntity";
  constructor(type: string, readonly item?: any) {
    super(type);
  }
}

@serializable()
export class ReadFileRequest extends Message {
  static readonly READ_FILE = "readFile";
  constructor(readonly filePath: string) {
    super(ReadFileRequest.READ_FILE);
  }

  static async dispatch(filePath: string, bus: IStreamableDispatcher<any>): Promise<Buffer> {
    return new Buffer((await readOneChunk(bus.dispatch(new ReadFileRequest(filePath)))).value, "base64");
  }
}

@serializable()
export class ReadDirectoryRequest extends Message {
  static readonly READ_DIRECTORY = "readDirectory";
  constructor(readonly directoryPath: string) {
    super(ReadDirectoryRequest.READ_DIRECTORY);
  }

  static dispatch(directoryPath: string, bus: IStreamableDispatcher<any>): ReadableStream<IReadFileResultItem[]> {
    return bus.dispatch(new ReadDirectoryRequest(directoryPath)).readable;
  }
}

@serializable()
export class WatchFileRequest extends Message {
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