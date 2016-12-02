import { IStudioEditorServerConfig } from "tandem-studio/server/config";
import { ApplicationConfigurationProvider } from "@tandem/core";
import { BaseCommand, Logger, loggable, inject } from "@tandem/common";

export abstract class BaseStudioServerCommand extends BaseCommand {

  @inject(ApplicationConfigurationProvider.ID)
  protected config:  IStudioEditorServerConfig;
}