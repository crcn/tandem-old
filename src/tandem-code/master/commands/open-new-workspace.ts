import qs =  require("qs");
import { MimeTypeProvider } from "@tandem/common";
import { TDPROJECT_MIME_TYPE } from "@tandem/tdproject-extension/constants";
import { BrowserWindow } from "electron";
import { BaseStudioMasterCommand } from "./base";
import { OpenNewWorkspaceRequest, CreateTemporaryWorkspaceRequest } from "tandem-code/common";

export class OpenNewWorkspaceCommand extends  BaseStudioMasterCommand {
  execute({ uri }: OpenNewWorkspaceRequest) {
    this.logger.info(`Opening workspace: ${uri}`);
    
    if (uri && MimeTypeProvider.lookup(uri, this.injector) !== TDPROJECT_MIME_TYPE) {
      return this.createAndOpenTandemWorkspaceFile(uri);
    } 

    this.openTandemWorkspaceFile(uri);
  }

  async createAndOpenTandemWorkspaceFile(uri: string) {
    this.openTandemWorkspaceFile(await CreateTemporaryWorkspaceRequest.dispatch(uri, this.bus));
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