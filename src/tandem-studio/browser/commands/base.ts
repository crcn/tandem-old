import { BaseEditorBrowserCommand } from "@tandem/editor/browser";
import { StudioPageNames } from "tandem-studio/browser/constants";
import { TandemStudioBrowserStore } from "tandem-studio/browser/stores";
import { inject } from "@tandem/common";
import { TandemStudioBrowserStoreProvider } from "tandem-studio/browser/providers";

export abstract class BaseStudioEditorBrowserCommand extends BaseEditorBrowserCommand {
  @inject(TandemStudioBrowserStoreProvider.ID)
  protected studioEditorStore: TandemStudioBrowserStore;
}