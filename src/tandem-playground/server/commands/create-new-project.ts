import { BasePlaygroundServerCommand } from "./base";
import { 
  Project,
  IProjectData, 
  CreateNewProjectRequest, 
} from "tandem-playground/common";

import { GetWorkerHostRequest } from "../messages";

export class CreateNewProjectCommand extends BasePlaygroundServerCommand {
  async execute(): Promise<Project> {

    this.logger.debug("Creating new project");

    const project = this.kernel.inject(new Project({
      content: `
        <tandem>
          <remote-browser />
        </tandem>
      `,
      host: await GetWorkerHostRequest.dispatch(this.bus) 
    }));
    
    await project.insert();

    return project;
  }
}