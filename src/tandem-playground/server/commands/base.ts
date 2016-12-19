import { inject, BaseCommand, ApplicationConfigurationProvider } from "@tandem/common";
import { IPlaygroundServerConfig } from "tandem-playground/server/config";

export abstract class BasePlaygroundServerCommand extends BaseCommand {
  @inject(ApplicationConfigurationProvider.ID)
  protected readonly config: IPlaygroundServerConfig;
}