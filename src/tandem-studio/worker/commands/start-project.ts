import { BaseCommand } from "@tandem/common";
import { StartProjectRequest } from "tandem-studio/common";
import { ProjectStarterFactoryProvider } from "tandem-studio/worker/providers";
import { BaseProjectStarter } from "tandem-studio/worker/project";

export class StartProjectCommand extends BaseCommand {
  async execute(request: StartProjectRequest) {
    this.logger.info("Starting new project");
    const starter = ProjectStarterFactoryProvider.create(request.option, this.injector);
    await starter.start();
  }
}