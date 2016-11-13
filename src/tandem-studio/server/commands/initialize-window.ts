import { BrowserWindow } from "electron";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { ApplicationConfigurationProvider } from "@tandem/core";
import { loggable, Logger, inject, Action, IActor, InitializeAction } from "@tandem/common"

@loggable()
export class InitializeWindowCommand implements IActor {

  protected logger: Logger;

  @inject(ApplicationConfigurationProvider.ID)
  private _config: IEdtorServerConfig;

  execute(action: Action) {
    this.logger.verbose("Opening browser window");
      try {
        const window = new BrowserWindow({width: 1024, height: 768 });
        window.loadURL(`file://${__dirname}/../../browser/index.html?backendPort=${this._config.port}`);
      } catch(e) {
        console.error(e.stack);
      }
  }
}