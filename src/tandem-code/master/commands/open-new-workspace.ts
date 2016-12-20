import qs =  require("qs");
import { BrowserWindow } from "electron";
import { MimeTypeProvider } from "@tandem/common";
import { TDPROJECT_MIME_TYPE } from "@tandem/tdproject-extension/constants";
import { BaseStudioMasterCommand } from "./base";
import { OpenNewWorkspaceRequest, CreateTemporaryWorkspaceRequest, ResolveWorkspaceURIRequest } from "tandem-code/common";

export class OpenNewWorkspaceCommand extends  BaseStudioMasterCommand {
  async execute({ project }: OpenNewWorkspaceRequest) {
    this.logger.info(`Opening workspace: ${project._id}`);

    try {

      let hash: string = "";
      let width: number = 600;
      let height: number = 400;
      let frame = true;

      const query = {
        backendPort: this.config.server.port
      } as any;

      width = 1024;
      height = 768;
      hash = `#/workspace/${project._id}`;

      const win = new BrowserWindow({ width: width, height: height, frame: frame, titleBarStyle: frame ? "hidden-inset" : undefined });

      win.loadURL(`${this.config.browser.indexUrl}?backendPort=${this.config.server.port}${hash}`);

      if (this.config.argv["dev-tools"]) {
        win["toggleDevTools"]();
      }
    } catch(e) {
      console.error(e.stack);
    }
  }
}