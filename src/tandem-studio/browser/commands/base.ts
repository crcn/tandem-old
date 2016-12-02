import { inject } from "@tandem/common";
import { BaseEditorBrowserCommand } from "@tandem/editor/browser";
import { TandemStudioBrowserStore } from "tandem-studio/browser/stores";
import { TandemStudioBrowserStoreProvider } from "tandem-studio/browser/providers";

export abstract class BaseStudioEditorBrowserCommand extends BaseEditorBrowserCommand {
  @inject(TandemStudioBrowserStoreProvider.ID)
  protected studioEditorStore: TandemStudioBrowserStore;
}