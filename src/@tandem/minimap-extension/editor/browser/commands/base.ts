import { inject } from "@tandem/common";
import { BaseEditorBrowserCommand } from "@tandem/editor/browser/commands";
import { MinimapRootStoreProvider } from "../providers";
import { MinimapExtensionRootStore } from "../stores";


export abstract class BaseMinimapBrowserCommand extends BaseEditorBrowserCommand {
  @inject(MinimapRootStoreProvider.ID)
  protected readonly minimapStore: MinimapExtensionRootStore;
}