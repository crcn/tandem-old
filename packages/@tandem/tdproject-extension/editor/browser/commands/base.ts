import { inject } from "@tandem/common";
import { TDProjectExtensionStore } from "@tandem/tdproject-extension/editor/browser/stores";
import { TandemExtensionStoreProvider } from "@tandem/tdproject-extension/editor/browser/providers";
import { BaseEditorBrowserCommand } from "@tandem/editor/browser/commands";

export abstract class BaseTDProjectExtensionCommand extends BaseEditorBrowserCommand {

  @inject(TandemExtensionStoreProvider.ID)
  protected readonly tdProjectStore: TDProjectExtensionStore;
  
}