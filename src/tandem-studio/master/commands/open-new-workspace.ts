import * as qs from "qs";
import { BrowserWindow } from "electron";
import { BaseStudioServerCommand } from "./base";
import { OpenNewWorkspaceRequest } from "tandem-studio/common";

export class OpenNewWorkspaceCommand extends BaseStudioServerCommand {
  execute({ filePath }: OpenNewWorkspaceRequest) {
    this.logger.info(`Opening workspace: ${filePath}`);

    try {

      let hash: string = "";
      let width: number = 600;
      let height: number = 400;

      const query = {
        backendPort: this.config.port
      } as any;

      if (filePath) {
        width = 1024;
        height = 768;
        hash = `#/workspace?workspacePath=${encodeURIComponent(filePath)}`;
      } else {
        hash = "#/welcome";
      }

      const win = new BrowserWindow({ width: width, height: height, titleBarStyle: "hidden" });

      win.loadURL(`${this.config.browser.indexUrl}?backendPort=${this.config.port}${hash}`);

      if (this.config.argv["dev-tools"]) {
        win["toggleDevTools"]();
      }
    } catch(e) {
      console.error(e.stack);
    }
  }
}