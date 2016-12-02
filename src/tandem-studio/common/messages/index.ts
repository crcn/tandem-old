import { IMessage } from "@tandem/mesh";
import { IStarterOption } from "tandem-studio/common/stores";
import { EditorFamilyType } from "@tandem/editor/common";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { OpenRemoteBrowserRequest } from "@tandem/editor/common";
import { 
  setMessageTarget, 
  addMessageVisitor, 
  IBus, 
  readAllChunks, 
  readOneChunk, 
  TransformStream 
} from "@tandem/mesh";

// scoping here
addMessageVisitor(EditorFamilyType.MASTER)(setMessageTarget(EditorFamilyType.WORKER)(ApplyFileEditRequest));
addMessageVisitor(EditorFamilyType.MASTER)(setMessageTarget(EditorFamilyType.WORKER)(OpenRemoteBrowserRequest));


@setMessageTarget(EditorFamilyType.MASTER)
export class OpenGettingStartedProjectRequest implements IMessage {
  static readonly OPEN_GETTING_STARTED: string = "openGettingStarted";
  readonly type = OpenGettingStartedProjectRequest.OPEN_GETTING_STARTED;
}

@setMessageTarget(EditorFamilyType.MASTER)
export class GetProjectStartOptionsRequest implements IMessage {
  static readonly GET_PROJECT_STARTER_OPTIONS: string = "getProjectStarterOption";
  readonly type = GetProjectStartOptionsRequest.GET_PROJECT_STARTER_OPTIONS;

  static async dispatch(bus: IBus<any>): Promise<IStarterOption[]> {
    return await readAllChunks(bus.dispatch(new GetProjectStartOptionsRequest()));
  }
}

@setMessageTarget(EditorFamilyType.MASTER)
export class StartNewProjectRequest implements IMessage {
  static readonly START_NEW_PROJECT: string = "startNewProject";
  readonly type = StartNewProjectRequest.START_NEW_PROJECT;
  constructor(readonly option: IStarterOption, readonly directoryPath: string) { }

  static async dispatch(option: IStarterOption, directoryPath: string, bus: IBus<any>) {
    return bus.dispatch(new StartNewProjectRequest(option, directoryPath));
  }
}

@setMessageTarget(EditorFamilyType.MASTER)
export class OpenNewWorkspaceRequest implements IMessage {
  static readonly OPEN_NEW_WORKSPACE: string = "openNewWorkspace";
  readonly type = OpenNewWorkspaceRequest.OPEN_NEW_WORKSPACE;
  constructor(readonly filePath: string) { }
}


@setMessageTarget(EditorFamilyType.MASTER)
export class SelectDirectoryRequest implements IMessage {
  static readonly SELECT_DIRECTORY_REQUEST: string = "selectDirectoryRequest";
  readonly type = SelectDirectoryRequest.SELECT_DIRECTORY_REQUEST;
  constructor() { }

  static async dispatch(bus: IBus<any>): Promise<string> {
    return (await readOneChunk<string>(bus.dispatch(new SelectDirectoryRequest()))).value;
  }
}
