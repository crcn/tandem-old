import { BrowserWindow } from "electron";
import { BaseServerCommand } from "./base";
import { OpenNewWorkspaceRequest } from "tandem-studio/common";

export class OpenNewWorkspaceCommand extends BaseServerCommand {
  execute(request: OpenNewWorkspaceRequest) {
    this.logger.info("Opening new workspace");

    try {
      const win = new BrowserWindow({ width: 600, height: 400, titleBarStyle: "hidden" });
      win.loadURL(`${this.config.browser.indexUrl}?backendPort=${this.config.port}&workspacePath=${encodeURIComponent(request.filePath)}`);

      if (this.config.argv["dev-tools"]) {
        win["toggleDevTools"]();
      }
    } catch(e) {
      console.error(e.stack);
    }
  }
}