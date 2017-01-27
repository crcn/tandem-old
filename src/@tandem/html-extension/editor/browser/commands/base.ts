import { BaseEditorBrowserCommand } from "@tandem/editor/browser/commands/base";
import { inject } from "@tandem/common";
import { HTMLExtensionStoreProvider } from "../providers";
import { HTMLExtensionStore } from "../stores";

export abstract class HTMLExtensionBaseCommand extends BaseEditorBrowserCommand {
  
  @inject(HTMLExtensionStoreProvider.ID)
  readonly htmlStore: HTMLExtensionStore;
} 