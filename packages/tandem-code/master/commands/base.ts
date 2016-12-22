import { TandemStudioMasterStore } from "tandem-code/master/stores";
import { IStudioEditorServerConfig } from "tandem-code/master/config";
import { TandemMasterStudioStoreProvider } from "tandem-code/master/providers";
import { 
  Logger, 
  inject, 
  loggable, 
  BaseCommand, 
  ApplicationConfigurationProvider,
} from "@tandem/common";

export abstract class  BaseStudioMasterCommand extends BaseCommand {
  
  @inject(TandemMasterStudioStoreProvider.ID)
  protected readonly masterStore: TandemStudioMasterStore;

  @inject(ApplicationConfigurationProvider.ID)
  protected readonly config:  IStudioEditorServerConfig;
}