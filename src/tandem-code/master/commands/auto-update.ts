import { BaseStudioMasterCommand } from "./base";
import { BannerPromptMessage } from "tandem-code/common/messages";
import { autoUpdater, app, dialog } from "electron";
import pkg = require("tandem-code/package");
import os = require("os");

export class AutoUpdateCommand extends BaseStudioMasterCommand {
  execute() {
    const platform = `${os.platform()}_${os.arch()}`;
    const version  = pkg["version"];

    if (process.env.DEV) return this.executeDevUpdater();

    autoUpdater.setFeedURL(this.config.updateFeedHost + `/update/${platform}/${version}`);

    autoUpdater.on("update-available", async () => {
      if (await this.restartPrompt()) autoUpdater.quitAndInstall();
    });

    autoUpdater.checkForUpdates();
  }

  executeDevUpdater() {
    // console.log(this.restartPrompt());
  }

  restartPrompt() {
    return dialog.showMessageBox({
      message: "A new update been downloaded & is ready to install.",
      buttons: ["Restart now", "cancel"]
    }) === 0;
  }
}