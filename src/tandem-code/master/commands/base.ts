import { IStudioEditorServerConfig } from "tandem-code/master/config";
import { ApplicationConfigurationProvider } from "@tandem/core";
import { BaseCommand, Logger, loggable, inject } from "@tandem/common";
import { TandemStudioMasterStore } from "tandem-code/master/stores";
import { TandemMasterStudioStoreProvider } from "tandem-code/master/providers";

export abstract class  BaseStudioMasterCommand extends BaseCommand {
  
  @inject(TandemMasterStudioStoreProvider.ID)
  protected readonly masterStore: TandemStudioMasterStore;

  @inject(ApplicationConfigurationProvider.ID)
  protected readonly config:  IStudioEditorServerConfig;
}