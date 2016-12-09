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
  // ReadDirectoryRequest,
  SandboxModuleAction,
} from "@tandem/sandbox";

import { 
  IMessage,
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
// setMessageTarget(EditorFamilyType.WORKER)(ReadDirectoryRequest);
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
  serialize({ uri, selection }: OpenFileRequest) {
    return { uri, selection };
  },
  deserialize({ uri, selection }, injector) {
    return new OpenFileRequest(uri, selection);
  }
})
export class OpenFileRequest extends CoreEvent {
  static readonly OPEN_FILE = "openSourceFile";
  constructor(readonly uri: string, readonly selection?: ISourceLocation) {
    super(OpenFileRequest.OPEN_FILE);
  }
  static dispatch(uri: string, selection: ISyntheticSourceInfo, bus: IStreamableDispatcher<any>) {
    // TODO - RESOLVE HERE
    return bus.dispatch(new OpenFileRequest(uri, selection));
  }
}

@addMessageVisitor(EditorFamilyType.WORKER)
@addMessageVisitor(EditorFamilyType.MASTER)
@setMessageTarget(EditorFamilyType.TEXT_EDITOR)
@serializable("SetCurrentFileRequest", {
  serialize({ uri, selection }: SetCurrentFileRequest) {
    return { uri, selection };
  },
  deserialize({ uri, selection }, injector) {
    return new SetCurrentFileRequest(uri, selection);
  }
})
export class SetCurrentFileRequest extends CoreEvent {
  static readonly SET_CURRENT_FILE = "setCurrentFile";
  constructor(readonly uri: string, readonly selection?: ISourceLocation) {
    super(SetCurrentFileRequest.SET_CURRENT_FILE);
  }
  static dispatch(uri: string, selection: ISyntheticSourceInfo, bus: IStreamableDispatcher<any>) {
    return bus.dispatch(new SetCurrentFileRequest(uri, selection));
  }
}



// opens the given workspace in this session
@setMessageTarget(EditorFamilyType.BROWSER)
@serializable("OpenWorkspaceRequest")
export class OpenWorkspaceRequest extends CoreEvent {
  static readonly OPEN_WORKSPACE = "openWorkspace";
  constructor(readonly uri: string) {
    super(OpenWorkspaceRequest.OPEN_WORKSPACE);
  }

  static async dispatch(uri: string, bus: IStreamableDispatcher<any>): Promise<boolean> {
    return (await readOneChunk(bus.dispatch(new OpenWorkspaceRequest(uri)))).value;
  }
}

@addMessageVisitor(EditorFamilyType.TEXT_EDITOR)
@addMessageVisitor(EditorFamilyType.WORKER)
@setMessageTarget(EditorFamilyType.MASTER)
@serializable("OpenNewWorkspaceRequest")
export class OpenNewWorkspaceRequest implements IMessage {
  static readonly OPEN_NEW_WORKSPACE: string = "openNewWorkspace";
  readonly type = OpenNewWorkspaceRequest.OPEN_NEW_WORKSPACE;
  constructor(readonly uri: string) { }
}


@addMessageVisitor(EditorFamilyType.BROWSER)
@addMessageVisitor(EditorFamilyType.MASTER)
@setMessageTarget(EditorFamilyType.WORKER)
@serializable("ImportFileRequest", {
  serialize({ uri, bounds, targetObject }: ImportFileRequest) {
    return [ uri, bounds, serialize(targetObject && targetObject.clone(false)) ];
  },
  deserialize([ uri, bounds, targetObject ], injector) {
    return new ImportFileRequest(uri, bounds, deserialize(targetObject, injector));
  }
})
export class ImportFileRequest extends CoreEvent {
  static readonly IMPORT_FILE = "importFile";
  readonly uri: string;
  constructor(uri: string, readonly bounds?: BoundingRect, readonly targetObject?: ISyntheticObject) {
    super(ImportFileRequest.IMPORT_FILE);
    this.uri = decodeURIComponent(uri);
  }
}

@setMessageTarget(EditorFamilyType.BROWSER)
@serializable("SelectSourceRequest", {
  serialize({ uri, ranges }: SelectSourceRequest) {
    return {
      uri: uri,
      ranges: ranges
    }
  },
  deserialize({ uri, ranges }): SelectSourceRequest {
    return new SelectSourceRequest(uri, ranges);
  }
})
export class SelectSourceRequest extends CoreEvent {
  static readonly SELECT_SOURCE = "selectSource";
  constructor(readonly uri: string, readonly ranges: ISourceLocation[]) {
    super(SelectSourceRequest.SELECT_SOURCE);
  }
}
