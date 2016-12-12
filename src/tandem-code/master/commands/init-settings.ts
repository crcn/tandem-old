import fs =  require("fs");
import path =  require("path");
import { merge } from "lodash";
import { IUserSettings } from "../stores";
import { BaseStudioMasterCommand } from "./base";

function getTextEditor() {
  return process.platform === "win32" ? {
    bin: "cmd",
    args: ["/c", "start", `""`]
  } : { 
    "bin": "/usr/bin/open",
    args: []
  }
}

function addDefaults(config: IUserSettings) {
  return merge({
    textEditor: getTextEditor()
  } as IUserSettings, config) as IUserSettings;
}

export class InitSettingsCommand extends BaseStudioMasterCommand {
  execute() {
    const configPath = path.join(this.config.settingsDirectory, "config.json");

    let config: IUserSettings;

    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, "utf8"))
    }

    this.masterStore.userSettings = addDefaults(config || {} as any);
    this.logger.info("Using settings: " + JSON.stringify(this.masterStore.userSettings, null, 2));
  }
}