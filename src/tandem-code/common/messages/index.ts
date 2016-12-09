import { IMessage } from "@tandem/mesh";
import { IStarterOption } from "tandem-code/common/stores";
import { EditorFamilyType } from "@tandem/editor/common";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { OpenRemoteBrowserRequest } from "@tandem/synthetic-browser";
import { 
  setMessageTarget, 
  addMessageVisitor, 
  IBus, 
  readAllChunks, 
  readOneChunk, 
  TransformStream 
} from "@tandem/mesh";

import { IHelpOption } from "tandem-code/common/stores";

// scoping here
addMessageVisitor(EditorFamilyType.MASTER)(setMessageTarget(EditorFamilyType.WORKER)(ApplyFileEditRequest));
addMessageVisitor(EditorFamilyType.MASTER)(setMessageTarget(EditorFamilyType.WORKER)(OpenRemoteBrowserRequest));

@setMessageTarget(EditorFamilyType.MASTER)
export class PingRequest implements IMessage {
  static readonly PING: string = "ping";
  readonly type = PingRequest.PING;
}


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

  static async dispatch(option: IStarterOption, directoryPath: string, bus: IBus<any>): Promise<string> {
    return (await readOneChunk<string>(bus.dispatch(new StartNewProjectRequest(option, directoryPath)))).value;
  }
}

@setMessageTarget(EditorFamilyType.MASTER)
export class OpenNewWorkspaceRequest implements IMessage {
  static readonly OPEN_NEW_WORKSPACE: string = "openNewWorkspace";
  readonly type = OpenNewWorkspaceRequest.OPEN_NEW_WORKSPACE;
  constructor(readonly uri: string) { }
}

@setMessageTarget(EditorFamilyType.MASTER)
export class CreateTemporaryWorkspaceRequest implements IMessage {
  static readonly CREATE_TEMPORARY_WORKSPACE: string = "createTemporaryWorkspace";
  readonly type = CreateTemporaryWorkspaceRequest.CREATE_TEMPORARY_WORKSPACE;
  constructor(readonly uri: string) { }

  static async dispatch(uri: string, bus: IBus<any>):Promise<string> {
    return (await readOneChunk<string>(bus.dispatch(new CreateTemporaryWorkspaceRequest(uri)))).value;
  }
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

@addMessageVisitor(EditorFamilyType.BROWSER)
export class BannerPromptMessage implements IMessage {
  static readonly BANNER_PROMPT: string = "bannerPrompt";
  readonly type = BannerPromptMessage.BANNER_PROMPT;
  constructor(readonly message: string, readonly okMessage: string) {

  }

  static async dispatch(message: string, okMessage: string, bus: IBus<any>): Promise<boolean> {
    return (await readOneChunk(bus.dispatch(new BannerPromptMessage(message, okMessage)))).value;
  }
}

@addMessageVisitor(EditorFamilyType.MASTER)
export class InstallCommandLineToolsRequest implements IMessage {
  static readonly INSTALL_COMMAND_LINE_TOOLS: string = "installCommandLineTools";
  readonly type = InstallCommandLineToolsRequest.INSTALL_COMMAND_LINE_TOOLS;
  constructor() {

  }
}

@setMessageTarget(EditorFamilyType.MASTER)
export class GetHelpOptionsRequest implements IMessage {
  static readonly GET_HELP_OPTIONS: string = "getHelpOptions";
  readonly type = GetHelpOptionsRequest.GET_HELP_OPTIONS;
  constructor() { }

  static async dispatch(bus: IBus<any>): Promise<IHelpOption[]> {
    return readAllChunks(bus.dispatch(new GetHelpOptionsRequest()));
  }
}


@setMessageTarget(EditorFamilyType.MASTER)
export class OpenHelpOptionRequest implements IMessage {
  static readonly OPEN_HELP_OPTION: string = "openHelpOption";
  readonly type = OpenHelpOptionRequest.OPEN_HELP_OPTION;
  constructor(readonly option: IHelpOption) { }

  static async dispatch(option: IHelpOption, bus: IBus<any>): Promise<any> {
    return bus.dispatch(new OpenHelpOptionRequest(option));
  }
}
