import qs =  require("qs");
import { MimeTypeProvider } from "@tandem/common";
import { TDPROJECT_MIME_TYPE } from "@tandem/tdproject-extension/constants";
import { BrowserWindow } from "electron";
import { BaseStudioMasterCommand } from "./base";
import { OpenNewWorkspaceRequest, CreateTemporaryWorkspaceRequest, ResolveWorkspaceURIRequest } from "tandem-code/common";

export class OpenNewWorkspaceCommand extends  BaseStudioMasterCommand {
  async execute({ uri }: OpenNewWorkspaceRequest) {
    this.logger.info(`Opening workspace: ${uri}`);

    this.openTandemWorkspaceFile(await ResolveWorkspaceURIRequest.dispatch(uri, this.bus));
  }

  openTandemWorkspaceFile(uri: string) {
    try {

      let hash: string = "";
      let width: number = 600;
      let height: number = 400;
      let frame = true;

      const query = {
        backendPort: this.config.port
      } as any;

      if (uri) {
        width = 1024;
        height = 768;
        hash = `#/workspace?workspaceUri=${encodeURIComponent(uri)}`;
      } else {
        hash = "#/welcome";
        frame = false;
      }

      const win = new BrowserWindow({ width: width, height: height, frame: frame, titleBarStyle: frame ? "hidden-inset" : undefined });

      win.loadURL(`${this.config.browser.indexUrl}?backendPort=${this.config.port}${hash}`);

      if (this.config.argv["dev-tools"]) {
        win["toggleDevTools"]();
      }
    } catch(e) {
      console.error(e.stack);
    }
  }
}