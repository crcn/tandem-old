import qs =  require("qs");
import { BrowserWindow } from "electron";
import { MimeTypeProvider } from "@tandem/common";
import { TDPROJECT_MIME_TYPE } from "@tandem/tdproject-extension/constants";
import { BaseStudioMasterCommand } from "./base";
import { Project, CreateNewProjectRequest } from "@tandem/editor/common"
import { OpenNewWorkspaceRequest, CreateTemporaryWorkspaceRequest, ResolveWorkspaceURIRequest, OpenBrowserWindowRequest } from "tandem-code/common";

export class OpenBrowserWindowCommand extends  BaseStudioMasterCommand {
  async execute({ hash, width, height }: OpenBrowserWindowRequest) {

    this.logger.info(`Opening browser window: ${hash}`);

    try {

      const query = {
        backendPort: this.config.server.port
      } as any;

      const win = new BrowserWindow({ width: width, height: height });

      win.loadURL(`${this.config.browser.indexUrl}?backendPort=${this.config.server.port}${hash}`);

      if (this.config.argv["dev-tools"]) {
        win["toggleDevTools"]();
      }
    } catch(e) {
      console.error(e.stack);
    }
  }
}