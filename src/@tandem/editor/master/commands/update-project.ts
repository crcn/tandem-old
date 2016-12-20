import { IInjectable } from "@tandem/common";
import { URIProtocolProvider } from "@tandem/sandbox";
import { BaseEditorMasterCommand } from "./base";
import { DSUpdateRequest, DSInsertRequest } from "@tandem/mesh";
import { GetProjectRequest, PROJECT_COLLECTION_NAME, Project, UpdateProjectRequest } from "@tandem/editor/common";

export class UpdateProjectCommand extends BaseEditorMasterCommand {
  async execute(request: UpdateProjectRequest) {
    this.logger.info(`Updating project: ${request.projectId}`);
    const data = (await DSUpdateRequest.dispatch(PROJECT_COLLECTION_NAME, request.data, { _id: request.projectId }, this.bus))[0];
    return data && this.kernel.inject(new Project(data));
  }
}