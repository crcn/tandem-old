import { IInjectable } from "@tandem/common";
import { URIProtocolProvider } from "@tandem/sandbox";
import { BaseEditorMasterCommand } from "./base";
import { WatchProjectRequest, PROJECT_COLLECTION_NAME, Project } from "@tandem/editor/common";
import { DSFindRequest, DSInsertRequest, DSTailRequest, DuplexStream, DSTailedOperation } from "@tandem/mesh";

export class WatchProjectCommand extends BaseEditorMasterCommand {
  execute(request: WatchProjectRequest) {
    this.logger.info(`Updating project: ${request.projectId}`);
    return DSTailRequest.dispatch(PROJECT_COLLECTION_NAME, { _id: request.projectId }, this.bus);
  }
}