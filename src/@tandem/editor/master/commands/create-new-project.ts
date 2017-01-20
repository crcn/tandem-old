import { IInjectable } from "@tandem/common";
import { URIProtocolProvider } from "@tandem/sandbox";
import { BaseEditorMasterCommand } from "./base";
import { DSFindRequest, DSInsertRequest } from "@tandem/mesh";
import { CreateNewProjectRequest, PROJECT_COLLECTION_NAME, Project, ResolveWorkspaceURIRequest } from "@tandem/editor/common";


export class CreateNewProjectCommand extends BaseEditorMasterCommand {
  async execute(request: CreateNewProjectRequest) {


    let uri = request.uri;

    if (uri && uri.charAt(0) === "/") {
      uri = "file://" + uri;
    }

    const data = (await DSInsertRequest.dispatch(PROJECT_COLLECTION_NAME, new Project({
      owner: request.owner,
      uri: await ResolveWorkspaceURIRequest.dispatch(uri, this.bus),
    }).serialize(), this.bus))[0];

    return this.kernel.inject(new Project(data));
  }
}