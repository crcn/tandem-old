import { BasePlaygroundServerCommand } from "./base";
import { DSFindRequest } from "@tandem/mesh";
import { GetProjectRequest, Project, PROJECT_COLLECTION_NAME } from "tandem-playground/common";

export class GetProjectCommand extends BasePlaygroundServerCommand {
  async execute(request: GetProjectRequest) {
    const data = await DSFindRequest.findOne(PROJECT_COLLECTION_NAME, {
      _id: request.id
    }, this.bus);

    // TODO - return 404 error
    if (!data) throw new Error("not found");
    return new Project(data);
  }
}