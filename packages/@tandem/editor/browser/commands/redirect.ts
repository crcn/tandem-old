import { BaseEditorBrowserCommand } from "./base";
import { RedirectRequest } from "@tandem/editor/browser/messages";

export class RedirectCommand extends BaseEditorBrowserCommand {
  execute(request: RedirectRequest) {
    this.editorStore.router.redirect(request);
  }
}