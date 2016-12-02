import { BaseStudioEditorBrowserCommand } from "./base";
import { StudioPageNames } from "tandem-studio/browser/constants";

export class InitializeWelcomePageCommand extends BaseStudioEditorBrowserCommand {
  execute() {
    if (!this.editorStore.workspace) {
      this.editorStore.router.redirect(StudioPageNames.WELCOME);
    } else {
      const width = 1024;
      const height = 768;
      window.resizeTo(width, height);
      window.moveTo(window.screen.width / 2 - width / 2, window.screen.height / 2 - height / 2);
    }
  }
}