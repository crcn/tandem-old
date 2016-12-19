import { Project } from "../stores";
import { EditorFamilyType } from "@tandem/editor/common";
import { IMessage, IStreamableDispatcher, readOneChunk, setMessageTarget } from "@tandem/mesh";

import { OpenRemoteBrowserRequest } from "@tandem/synthetic-browser";

setMessageTarget(EditorFamilyType.WORKER)(OpenRemoteBrowserRequest);

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