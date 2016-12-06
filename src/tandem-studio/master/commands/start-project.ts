import fs =  require("fs");
import path =  require("path");

import { BaseCommand } from "@tandem/common";
import { BaseProjectStarter } from "tandem-studio/master/project";
import { ProjectStarterFactoryProvider } from "tandem-studio/master/providers";
import { StartNewProjectRequest, OpenWorkspaceRequest } from "tandem-studio/common";

export class StartProjectCommand extends BaseCommand {
  async execute(request: StartNewProjectRequest) {
    this.logger.info(`Starting new ${request.option.label} project in ${request.directoryPath}`);
    
    const starter = ProjectStarterFactoryProvider.create(request.option, this.injector);
    const { workspaceFilePath } = await starter.start(request.directoryPath);

    return workspaceFilePath; 
  }
}