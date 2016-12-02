import * as qs from "qs";
import { BrowserWindow } from "electron";
import { BaseStudioServerCommand } from "./base";
import { OpenNewWorkspaceRequest } from "tandem-studio/common";

export class OpenNewWorkspaceCommand extends BaseStudioServerCommand {
  execute({ filePath }: OpenNewWorkspaceRequest) {
    this.logger.info(`Opening workspace: ${filePath}`);

    try {
      const win = new BrowserWindow({ width: 600, height: 400, titleBarStyle: "hidden" });

      const query = {
        backendPort: this.config.port
      } as any;

      if (filePath) {
        query.workspacePath = filePath;
      }

      win.loadURL(`${this.config.browser.indexUrl}?${qs.stringify(query)}`);

      if (this.config.argv["dev-tools"]) {
        win["toggleDevTools"]();
      }
    } catch(e) {
      console.error(e.stack);
    }
  }
}