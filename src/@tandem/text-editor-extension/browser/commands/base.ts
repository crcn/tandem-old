import { BaseEditorBrowserCommand } from "@tandem/editor/browser/commands/base";
import { inject } from "@tandem/common";
import { PlaygroundBrowserStoreProvider } from "../providers";
import { RootPlaygroundBrowserStore } from "../stores";

export abstract class BaseEditorPlaygroundBrowserCommand extends BaseEditorBrowserCommand {
  @inject(PlaygroundBrowserStoreProvider.ID)
  protected readonly playgroundStore: RootPlaygroundBrowserStore;
}