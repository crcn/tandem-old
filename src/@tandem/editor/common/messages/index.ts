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


setMessageTarget(EditorFamilyType.WORKER)(WatchFileRequest);
setMessageTarget(EditorFamilyType.WORKER)(ReadFileRequest);
setMessageTarget(EditorFamilyType.WORKER)(ReadDirectoryRequest);
setMessageTarget(EditorFamilyType.WORKER)(ResolveFileRequest);
setMessageTarget(EditorFamilyType.WORKER)(ApplyFileEditRequest);

setMessageTarget(EditorFamilyType.WORKER)(DSFindRequest);
setMessageTarget(EditorFamilyType.WORKER)(DSUpsertRequest);
setMessageTarget(EditorFamilyType.WORKER)(DSInsertRequest);
setMessageTarget(EditorFamilyType.WORKER)(DSRemoveRequest);
setMessageTarget(EditorFamilyType.WORKER)(DSUpdateRequest);
setMessageTarget(EditorFamilyType.WORKER)(DSFindAllRequest);

addMessageVisitor(EditorFamilyType.MASTER, EditorFamilyType.WORKER, EditorFamilyType.TEXT_EDITOR)(PostDSMessage);


@addMessageVisitor(EditorFamilyType.BROWSER)
@addMessageVisitor(EditorFamilyType.WORKER)
@setMessageTarget(EditorFamilyType.MASTER)
@serializable("OpenFileRequest", {
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

@addMessageVisitor(EditorFamilyType.WORKER)
@addMessageVisitor(EditorFamilyType.MASTER)
@setMessageTarget(EditorFamilyType.TEXT_EDITOR)
@serializable("SetCurrentFileRequest", {
  serialize({ filePath, selection }: SetCurrentFileRequest) {
    return { filePath, selection };
  },
  deserialize({ filePath, selection }, injector) {
    return new SetCurrentFileRequest(filePath, selection);
  }
})
export class SetCurrentFileRequest extends CoreEvent {
  static readonly SET_CURRENT_FILE = "setCurrentFile";
  constructor(readonly filePath: string, readonly selection?: ISourceLocation) {
    super(SetCurrentFileRequest.SET_CURRENT_FILE);
  }
  static dispatch(filePath: string, selection: ISyntheticSourceInfo, bus: IStreamableDispatcher<any>) {
    return bus.dispatch(new SetCurrentFileRequest(filePath, selection));
  }
}



// opens the given workspace in this session
@setMessageTarget(EditorFamilyType.BROWSER)
@serializable("OpenWorkspaceRequest")
export class OpenWorkspaceRequest extends CoreEvent {
  static readonly OPEN_WORKSPACE = "openWorkspace";
  constructor(readonly filePath: string) {
    super(OpenWorkspaceRequest.OPEN_WORKSPACE);
  }
  static async dispatch(filePath: string, bus: IStreamableDispatcher<any>): Promise<boolean> {
    return (await readOneChunk(bus.dispatch(new OpenWorkspaceRequest(filePath)))).value;
  }
}

@addMessageVisitor(EditorFamilyType.BROWSER)
@addMessageVisitor(EditorFamilyType.MASTER)
@setMessageTarget(EditorFamilyType.WORKER)
@serializable("ImportFileRequest", {
  serialize({ filePath, bounds, targetObject }: ImportFileRequest) {
    return [ filePath, bounds, serialize(targetObject && targetObject.clone(false)) ];
  },
  deserialize([ filePath, bounds, targetObject ], injector) {
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

@setMessageTarget(EditorFamilyType.BROWSER)
@serializable("SelectSourceRequest", {
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
