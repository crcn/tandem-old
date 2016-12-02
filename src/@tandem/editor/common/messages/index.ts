import { ISyntheticSourceInfo } from "@tandem/sandbox";
import { RemoteBrowserDocumentMessage, OpenRemoteBrowserRequest } from "@tandem/synthetic-browser";
import {
  CoreEvent,
  Mutation,
  serialize,
  deserialize,
  BoundingRect,
  serializable,
  ChildMutation,
  PostDSMessage,
  RemoveMutation,
  DSUpsertRequest,
  ISourceLocation,
  MoveChildMutation,
} from "@tandem/common";

import {
  FileCacheAction,
  ReadFileRequest,
  WatchFileRequest,
  DependencyEvent,
  ISyntheticObject,
  ResolveFileRequest,
  ApplyFileEditRequest,
  ReadDirectoryRequest,
  SandboxModuleAction,
} from "@tandem/sandbox";

import { 
  readOneChunk,
  DSFindRequest,
  DSInsertRequest,
  DSRemoveRequest,
  DSUpdateRequest,
  DSFindAllRequest,
  TransformStream,
  setMessageTarget,
  addMessageVisitor,
  IStreamableDispatcher,
} from "@tandem/mesh";

export namespace EditorFamilyType {

  /**
   * Peer (client) application such as an extension
   */

  export const TEXT_EDITOR    = "textEditor";

  /**
   * editor app
   */

  export const BROWSER = "browser";

  /**
   * Heavy lifter - may be a web worker, node worker, or live in a remote location
   */

  export const WORKER  = "worker";

  /**
   * Main app all others talk to
   */

  export const MASTER  = "master";
}

setMessageTarget(EditorFamilyType.MASTER)(WatchFileRequest);
addMessageVisitor(EditorFamilyType.MASTER)(setMessageTarget(EditorFamilyType.WORKER)(OpenRemoteBrowserRequest));
setMessageTarget(EditorFamilyType.MASTER)(ReadFileRequest);
setMessageTarget(EditorFamilyType.MASTER)(ReadDirectoryRequest);
setMessageTarget(EditorFamilyType.MASTER)(ResolveFileRequest);
setMessageTarget(EditorFamilyType.MASTER)(ApplyFileEditRequest);

setMessageTarget(EditorFamilyType.MASTER)(DSFindRequest);
setMessageTarget(EditorFamilyType.MASTER)(DSUpsertRequest);
setMessageTarget(EditorFamilyType.MASTER)(DSInsertRequest);
setMessageTarget(EditorFamilyType.MASTER)(DSRemoveRequest);
setMessageTarget(EditorFamilyType.MASTER)(DSUpdateRequest);
setMessageTarget(EditorFamilyType.MASTER)(DSFindAllRequest);
addMessageVisitor(EditorFamilyType.MASTER, EditorFamilyType.WORKER, EditorFamilyType.TEXT_EDITOR)(PostDSMessage);

@setMessageTarget(EditorFamilyType.MASTER)
export class GetPrimaryProjectFilePathRequest extends CoreEvent {
  static readonly GET_PRIMARY_PROJECT_FILE_PATH = "getPrimaryProjectFilePath";
  constructor() {
    super(GetPrimaryProjectFilePathRequest.GET_PRIMARY_PROJECT_FILE_PATH);
  }
  static async dispatch(dispatcher: IStreamableDispatcher<any>): Promise<string> {
    return (await readOneChunk(dispatcher.dispatch(new GetPrimaryProjectFilePathRequest()))).value;
  }
}

@setMessageTarget(EditorFamilyType.MASTER)
export class GetServerPortRequest extends CoreEvent {
  static readonly GET_SERVER_PORT = "getServerPort";
  constructor() {
    super(GetServerPortRequest.GET_SERVER_PORT);
  }
  static async dispatch(bus: IStreamableDispatcher<any>) {
    return (await readOneChunk(bus.dispatch(new GetServerPortRequest()))).value;
  }
}


@addMessageVisitor(EditorFamilyType.MASTER, EditorFamilyType.WORKER, EditorFamilyType.BROWSER)
@setMessageTarget(EditorFamilyType.TEXT_EDITOR)
@serializable({
  serialize({ filePath, selection }: OpenFileRequest) {
    return { filePath, selection };
  },
  deserialize({ filePath, selection }, injector) {
    return new OpenFileRequest(filePath, selection);
  }
})
export class OpenFileRequest extends CoreEvent {
  static readonly OPEN_FILE = "openSourceFile";
  constructor(readonly filePath: string, readonly selection?: ISourceLocation) {
    super(OpenFileRequest.OPEN_FILE);
  }
  static dispatch(filePath: string, selection: ISyntheticSourceInfo, bus: IStreamableDispatcher<any>) {
    // TODO - RESOLVE HERE
    return bus.dispatch(new OpenFileRequest(filePath, selection));
  }
}

// opens the given workspace in this session
export class OpenWorkspaceRequest extends CoreEvent {
  static readonly OPEN_WORKSPACE = "openWorkspace";
  constructor(readonly filePath: string) {
    super(OpenWorkspaceRequest.OPEN_WORKSPACE);
  }
  static async dispatch(filePath: string, bus: IStreamableDispatcher<any>): Promise<boolean> {
    return (await readOneChunk(bus.dispatch(new OpenWorkspaceRequest(filePath)))).value;
  }
}

@setMessageTarget(EditorFamilyType.MASTER)
@serializable({
  serialize({ filePath, bounds, targetObject }: ImportFileRequest) {
    return { filePath, bounds, targetObject: serialize(targetObject && targetObject.clone(false)) };
  },
  deserialize({ filePath, bounds, targetObject }, injector) {
    return new ImportFileRequest(filePath, bounds, deserialize(targetObject, injector));
  }
})
export class ImportFileRequest extends CoreEvent {
  static readonly IMPORT_FILE = "importFile";
  readonly filePath: string;
  constructor(filePath: string, readonly bounds?: BoundingRect, readonly targetObject?: ISyntheticObject) {
    super(ImportFileRequest.IMPORT_FILE);
    this.filePath = decodeURIComponent(filePath);
  }
}

@addMessageVisitor(EditorFamilyType.MASTER)
@setMessageTarget(EditorFamilyType.BROWSER)
@serializable({
  serialize({ filePath, ranges }: SelectSourceRequest) {
    return {
      filePath: filePath,
      ranges: ranges
    }
  },
  deserialize({ filePath, ranges }): SelectSourceRequest {
    return new SelectSourceRequest(filePath, ranges);
  }
})
export class SelectSourceRequest extends CoreEvent {
  static readonly SELECT_SOURCE = "selectSource";
  constructor(readonly filePath: string, readonly ranges: ISourceLocation[]) {
    super(SelectSourceRequest.SELECT_SOURCE);
  }
}
