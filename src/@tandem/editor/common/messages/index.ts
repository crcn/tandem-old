import { ISyntheticSourceInfo } from "@tandem/sandbox";
import { Action, serializable, ISourceLocation, DSUpsertRequest, PostDSMessage } from "@tandem/common";

import {
  EditAction,
  SandboxAction,
  FileCacheAction,
  ReadFileRequest,
  ChildEditAction,
  WatchFileRequest,
  DependencyAction,
  FileEditorAction,
  RemoveEditAction,
  ResolveFileRequest,
  ApplyFileEditRequest,
  MoveChildEditAction,
  ReadDirectoryRequest,
  SandboxModuleAction,
  ApplicableEditAction
} from "@tandem/sandbox";

import { 
  DSFindRequest,
  DSInsertRequest,
  DSRemoveRequest,
  DSUpdateRequest,
  DSFindAllRequest,
  readOneChunk,
  TransformStream,
  setMessageTarget,
  addMessageVisitor,
  IStreamableDispatcher,
} from "@tandem/mesh";

export namespace EditorFamilyType {
  export const BROWSER = "editor";
  export const WORKER  = "worker";
  export const MASTER  = "master";
}

setMessageTarget(EditorFamilyType.MASTER)(WatchFileRequest);
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
setMessageTarget(EditorFamilyType.MASTER)(PostDSMessage);

@setMessageTarget(EditorFamilyType.MASTER)
export class GetPrimaryProjectFilePathAction extends Action {
  static readonly GET_PRIMARY_PROJECT_FILE_PATH = "getPrimaryProjectFilePath";
  constructor() {
    super(GetPrimaryProjectFilePathAction.GET_PRIMARY_PROJECT_FILE_PATH);
  }
  static async dispatch(dispatcher: IStreamableDispatcher<any>): Promise<string> {
    return (await readOneChunk(dispatcher.dispatch(new GetPrimaryProjectFilePathAction()))).value;
  }
}

@setMessageTarget(EditorFamilyType.MASTER)
export class GetServerPortRequest extends Action {
  static readonly GET_SERVER_PORT = "getServerPort";
  constructor() {
    super(GetServerPortRequest.GET_SERVER_PORT);
  }
  static async dispatch(bus: IStreamableDispatcher<any>) {
    return (await readOneChunk(bus.dispatch(new GetServerPortRequest()))).value;
  }
}

@setMessageTarget(EditorFamilyType.MASTER)
@serializable({
  serialize({ filePath, selection }: OpenFileRequest) {
    return { filePath, selection };
  },
  deserialize({ filePath, selection }, injector) {
    return new OpenFileRequest(filePath, selection);
  }
})
export class OpenFileRequest extends Action {
  static readonly OPEN_FILE = "openSourceFile";
  constructor(readonly filePath: string, readonly selection?: ISourceLocation) {
    super(OpenFileRequest.OPEN_FILE);
  }
  static dispatch(filePath: string, selection: ISyntheticSourceInfo, bus: IStreamableDispatcher<any>) {
    // TODO - RESOLVE HERE
    return bus.dispatch(new OpenFileRequest(filePath, selection));
  }
}

@setMessageTarget(EditorFamilyType.MASTER)
export class OpenProjectRequest extends Action {
  static readonly OPEN_PROJECT_FILE = "openProjectFile";
  constructor(readonly filePath: string) {
    super(OpenProjectRequest.OPEN_PROJECT_FILE);
  }
  static async dispatch({ filePath }: { filePath: string }, bus: IStreamableDispatcher<any>): Promise<boolean> {
    return (await readOneChunk(bus.dispatch(new OpenProjectRequest(filePath)))).value;
  }
}


@serializable({
  serialize({ filePaths, options }: AddFilesAction) {
    return { filePaths, options }
  },
  deserialize({ filePaths, options}) {
    return new AddFilesAction(filePaths, options);
  }
})
@setMessageTarget(EditorFamilyType.MASTER)
export class AddFilesAction extends Action {
  static readonly ADD_FILES = "addFiles";
  constructor(readonly filePaths: string[], readonly options?: { left: number, top: number }) {
    super(AddFilesAction.ADD_FILES);
  }
}

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
@addMessageVisitor(EditorFamilyType.MASTER)
@setMessageTarget(EditorFamilyType.BROWSER)
export class SelectSourceRequest extends Action {
  static readonly SELECT_SOURCE = "selectSource";
  constructor(readonly filePath: string, readonly ranges: ISourceLocation[]) {
    super(SelectSourceRequest.SELECT_SOURCE);
  }
}
