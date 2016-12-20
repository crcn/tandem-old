import { IInjectable } from "@tandem/common";
import { URIProtocolProvider } from "@tandem/sandbox";
import { BaseEditorMasterCommand } from "./base";
import { DSFindRequest, DSInsertRequest } from "@tandem/mesh";
import { GetProjectRequest, PROJECT_COLLECTION_NAME, Project } from "@tandem/editor/common";

export class GetProjectCommand extends BaseEditorMasterCommand {
  async execute(request: GetProjectRequest) {
    this.logger.info(`Getting project: ${request.projectId}`);
    const data = (await DSFindRequest.findOne(PROJECT_COLLECTION_NAME, { _id: request.projectId }, this.bus));
    return this.kernel.inject(new Project(data));
  }
}