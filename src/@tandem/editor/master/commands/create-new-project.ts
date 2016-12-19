import { URIProtocolProvider } from "@tandem/sandbox";
import { BaseEditorMasterCommand } from "./base";
import { CreateNewProjectRequest, PROJECT_COLLECTION_NAME, Project, ResolveWorkspaceURIRequest } from "@tandem/editor/common";
import { DSFindRequest, DSInsertRequest } from "@tandem/mesh";

export class CreateNewProjectCommand extends BaseEditorMasterCommand {
  async execute(request: CreateNewProjectRequest) {
    
    this.logger.info("Creating new project");

    const data = (await DSInsertRequest.dispatch(PROJECT_COLLECTION_NAME, new Project({
      owner: request.owner,
      uri: await ResolveWorkspaceURIRequest.dispatch(request.uri, this.bus),
    }).serialize(), this.bus))[0];

    return new Project(data);
  }
}