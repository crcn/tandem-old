import { BaseStudioEditorBrowserCommand } from "./base";
import { remote } from "electron";
const { Menu } = remote;
import { StudioRouteNames } from "tandem-studio/browser/constants";
import { WebMenuItem, EditorRouteNames, DidRedirectMessage } from "@tandem/editor/browser";

export class SetMenuCommand extends BaseStudioEditorBrowserCommand {
  execute({ state }: DidRedirectMessage) {

    const root = this.injector.inject(new WebMenuItem(state[EditorRouteNames.ROOT]));
    root.initialize();

    Menu.setApplicationMenu(Menu.buildFromTemplate(root.toMenuTemplate().submenu));
  }
}