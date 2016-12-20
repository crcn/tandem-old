import { BaseCommand, ApplicationConfigurationProvider, inject } from "@tandem/common";
import { IEditorCommonConfig } from "@tandem/editor/common";
import { IEditorMasterConfig } from "../config";
import { EditorMasterStoreProvider } from "../providers";
import { EditorMasterStore } from "../stores";

export abstract class BaseEditorMasterCommand extends BaseCommand {
  @inject(ApplicationConfigurationProvider.ID)
  protected readonly config:  IEditorMasterConfig;
  
  @inject(EditorMasterStoreProvider.ID)
  protected readonly store: EditorMasterStore;
}