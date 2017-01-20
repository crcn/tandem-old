import qs =  require("qs");
import { BrowserWindow } from "electron";
import { MimeTypeProvider } from "@tandem/common";
import { TDPROJECT_MIME_TYPE } from "@tandem/tdproject-extension/constants";
import { BaseStudioMasterCommand } from "./base";
import { Project, CreateNewProjectRequest } from "@tandem/editor/common"
import { OpenNewWorkspaceRequest, CreateTemporaryWorkspaceRequest, ResolveWorkspaceURIRequest, OpenBrowserWindowRequest } from "tandem-code/common";

export class OpenNewWorkspaceCommand extends  BaseStudioMasterCommand {
  async execute({ projectOrFilePath }: OpenNewWorkspaceRequest) {

    let project: Project;

    if (projectOrFilePath instanceof Project) {
      project = projectOrFilePath;
    } else {
      project = await CreateNewProjectRequest.dispatch(null, projectOrFilePath, this.bus);
    }
    
    this.logger.info(`Opening workspace: ${project._id}`);

    let hash: string = "";
    let width: number = 600;
    let height: number = 400;

    const query = {
      backendPort: this.config.server.port
    } as any;

    width = 1024;
    height = 768;
    hash = `#/workspace/${project._id}`;

    this.bus.dispatch(new OpenBrowserWindowRequest(hash, width, height));
  }
}