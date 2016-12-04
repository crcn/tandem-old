import { IStudioEditorServerConfig } from "tandem-studio/master/config";
import { ApplicationConfigurationProvider } from "@tandem/core";
import { BaseCommand, Logger, loggable, inject } from "@tandem/common";
import { TandemStudioMasterStore } from "tandem-studio/master/stores";
import { TandemMasterStudioStoreProvider } from "tandem-studio/master/providers";

export abstract class BaseStudioServerCommand extends BaseCommand {
  @inject(TandemMasterStudioStoreProvider.ID)
  protected readonly store: TandemStudioMasterStore;

  @inject(ApplicationConfigurationProvider.ID)
  protected readonly config:  IStudioEditorServerConfig;
}