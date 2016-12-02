import { BaseStudioEditorBrowserCommand } from "./base";
import { StudioRouteNames } from "tandem-studio/browser/constants";
import { RedirectRequest } from "@tandem/editor/browser/messages";

export class InitializeWelcomePageCommand extends BaseStudioEditorBrowserCommand {
  async execute() {
    if (!this.editorStore.workspace) {
      await this.bus.dispatch(new RedirectRequest(StudioRouteNames.WELCOME))
    }
  }
}