import { BaseStudioEditorBrowserCommand } from "./base";
import { 
  WebMenuItem,
  ContextMenuTypes, 
  OpenContextMenuRequest, 
  WebMenuItemFactoryProvider 
} from "@tandem/editor/browser";

export class OpenContextMenuCommand extends BaseStudioEditorBrowserCommand {
  execute(request: OpenContextMenuRequest) {

    // timeout for a sec to ensure that any previous action isn't blocked
    setTimeout(() => {
      const { remote } = require("electron");
      const menu = this.kernel.inject(new WebMenuItem(request.name));
      menu.initialize();
      const electronMenu = remote.Menu.buildFromTemplate(menu.toMenuTemplate().submenu);
      electronMenu.popup();
    }, 200);
  }
}