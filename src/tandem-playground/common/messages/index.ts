import { Project } from "../stores";
import { EditorFamilyType } from "@tandem/editor/common";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { IMessage, IStreamableDispatcher, readOneChunk, setMessageTarget } from "@tandem/mesh";

import { OpenRemoteBrowserRequest } from "@tandem/synthetic-browser";

setMessageTarget(EditorFamilyType.WORKER)(OpenRemoteBrowserRequest);
setMessageTarget(EditorFamilyType.WORKER)(ApplyFileEditRequest);

@setMessageTarget(EditorFamilyType.MASTER)
export class CreateNewProjectRequest implements IMessage {
  static CREATE_NEW_PROJECT = "createNewProject";
  readonly type = CreateNewProjectRequest.CREATE_NEW_PROJECT;
  constructor()  { }
  static async dispatch(dispatcher: IStreamableDispatcher<any>): Promise<Project> {
    const result = (await readOneChunk(dispatcher.dispatch(new CreateNewProjectRequest()))).value;
    return result;
  }
}

@setMessageTarget(EditorFamilyType.MASTER)
export class GetProjectRequest implements IMessage {
  static GET_PROJECT = "getProjectRequest";
  readonly type = GetProjectRequest.GET_PROJECT;
  constructor(readonly id: string)  { }
  static async dispatch(id: string, dispatcher: IStreamableDispatcher<any>): Promise<Project> {
    const result = (await readOneChunk(dispatcher.dispatch(new GetProjectRequest(id)))).value;
    return result;
  }
}