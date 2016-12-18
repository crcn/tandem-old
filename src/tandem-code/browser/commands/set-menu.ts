import { BaseStudioEditorBrowserCommand } from "./base";
import { StudioRouteNames } from "tandem-code/browser/constants";
import { WebMenuItem, EditorRouteNames, DidRedirectMessage } from "@tandem/editor/browser";

export class SetMenuCommand extends BaseStudioEditorBrowserCommand {
  execute({ state }: DidRedirectMessage) {

    if (window["$synthetic"]) return;

    // require at runtime to prevent breakages within tandem
    const { remote } = require("electron");
    const { Menu } = remote;

    const root = this.kernel.inject(new WebMenuItem(state[EditorRouteNames.ROOT]));
    root.initialize();

    Menu.setApplicationMenu(Menu.buildFromTemplate(root.toMenuTemplate().submenu));
  }
}