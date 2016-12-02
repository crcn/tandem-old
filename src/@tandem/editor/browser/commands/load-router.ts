import { Router } from "@tandem/editor/browser/stores";
import { RedirectRequest } from "@tandem/editor/browser/messages";
import { PropertyWatcher } from "@tandem/common";
import { BaseEditorBrowserCommand } from "./base";

export class LoadRouterCommand extends BaseEditorBrowserCommand {
  execute() {
    const router = this.editorStore.router = this.injector.inject(new Router());

    router.currentPathWatcher.connect((newPath) => {
      window.location.hash = newPath;
    });

    const sync = () => {
      const path = window.location.hash.substr(1);
      if (path) router.redirect(RedirectRequest.fromURL(path));
    } 

    window.onhashchange = sync;
    sync();
  }
}