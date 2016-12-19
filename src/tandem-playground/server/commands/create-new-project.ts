import { ConsoleLogService, ResolveWorkspaceURIRequest } from "@tandem/editor/common";
import { createSandboxProviders } from "@tandem/sandbox";
import { BasePlaygroundServerCommand } from "./base";
import { createSyntheticHTMLProviders } from "@tandem/synthetic-browser";
import { 
  Kernel, 
  BrokerBus, 
  DSService,
  KernelProvider, 
  PrivateBusProvider, 
  ServiceApplication,
  ApplicationServiceProvider,
  ApplicationConfigurationProvider,
} from "@tandem/common";

import { 
  Project,
  IProjectData, 
  CreateNewProjectRequest, 
} from "tandem-playground/common";

// import { GetWorkerHostRequest } from "../messages";

export class CreateNewProjectCommand extends BasePlaygroundServerCommand {
  async execute(): Promise<Project> {

    this.logger.debug("Creating new project");

    const project = this.kernel.inject(new Project({
      content: `
        <tandem>
          <remote-browser />
        </tandem>
      `
    }));

    await project.save();

    // create an isolated environment for all interactions in the workspace
    const kernel = new Kernel(
      new KernelProvider(),
      new PrivateBusProvider(new BrokerBus()),
      createSandboxProviders(),
      createSyntheticHTMLProviders(),
      new ApplicationServiceProvider("ds", DSService),
      new ApplicationServiceProvider("console", ConsoleLogService),
    );

    const app = new ServiceApplication(kernel);
    await app.initialize();

    return project;
  }
}