import { IMessage } from "@tandem/mesh";
import { BrowserWindow } from "electron";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { ApplicationConfigurationProvider } from "@tandem/core";
import { loggable, Logger, inject, ICommand, InitializeApplicationRequest } from "@tandem/common"

@loggable()
export class InitializeWindowCommand implements ICommand {

  protected logger: Logger;

  @inject(ApplicationConfigurationProvider.ID)
  private _config: IEdtorServerConfig;

  execute(message: IMessage) {
    this.logger.debug("Opening browser window");
    try {
      const win = new BrowserWindow({ width: 600, height: 400, titleBarStyle: "hidden" });
      win.loadURL(`file://${__dirname}/../../browser/index.html?backendPort=${this._config.port}#/workspace`);
      // console.log(window["tog"])
      if (this._config.argv["dev-tools"]) {
        win["toggleDevTools"]();
      }
    } catch(e) {
      console.error(e.stack);
    }
  }
}