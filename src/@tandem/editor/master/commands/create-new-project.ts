import { IInjectable } from "@tandem/common";
import { URIProtocolProvider } from "@tandem/sandbox";
import { BaseEditorMasterCommand } from "./base";
import { DSFindRequest, DSInsertRequest } from "@tandem/mesh";
import { CreateNewProjectRequest, PROJECT_COLLECTION_NAME, Project, ResolveWorkspaceURIRequest } from "@tandem/editor/common";


export class CreateNewProjectCommand extends BaseEditorMasterCommand {
  async execute(request: CreateNewProjectRequest) {

    const data = (await DSInsertRequest.dispatch(PROJECT_COLLECTION_NAME, new Project({
      owner: request.owner,
      uri: await ResolveWorkspaceURIRequest.dispatch(request.uri, this.bus),
    }).serialize(), this.bus))[0];

    return this.kernel.inject(new Project(data));
  }
}