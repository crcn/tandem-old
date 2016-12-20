import { BaseCommand, ApplicationConfigurationProvider, inject } from "@tandem/common";
import { IEditorCommonConfig } from "@tandem/editor/common";
import { IEditorMasterConfig } from "../config";

export abstract class BaseEditorMasterCommand extends BaseCommand {
  @inject(ApplicationConfigurationProvider.ID)
  protected readonly config:  IEditorMasterConfig;
}