import { BaseCommand } from "@tandem/common";
import { StartProjectRequest } from "tandem-studio/common";
import { ProjectStarterFactoryProvider } from "tandem-studio/master/providers";
import { BaseProjectStarter } from "tandem-studio/master/project";

export class StartProjectCommand extends BaseCommand {
  async execute(request: StartProjectRequest) {
    this.logger.info("Starting new project");
    const starter = ProjectStarterFactoryProvider.create(request.option, this.injector);
    await starter.start();
  }
}