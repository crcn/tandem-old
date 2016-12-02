import { IMessage } from "@tandem/mesh";
import { IStarterOption } from "tandem-studio/common/stores";
import { EditorFamilyType } from "@tandem/editor/common";
import { setMessageTarget, IBus, readAllChunks } from "@tandem/mesh";

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
export class StartProjectRequest implements IMessage {
  static readonly START_NEW_PROJECT: string = "startNewProject";
  readonly type = StartProjectRequest.START_NEW_PROJECT;
  constructor(readonly option: IStarterOption) { }

  static async dispatch(option: IStarterOption, bus: IBus<any>) {
    return bus.dispatch(new StartProjectRequest(option));
  }
}