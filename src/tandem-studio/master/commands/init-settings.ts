import * as fs from "fs";
import * as path from "path";
import { merge } from "lodash";
import { IUserSettings } from "../stores";
import { BaseStudioMasterCommand } from "./base";

function getTextEditorBin() {
  return "/usr/bin/open";
}

function addDefaults(config: IUserSettings) {
  return merge({
    textEditor: {
      bin: getTextEditorBin()
    }
  } as IUserSettings, config) as IUserSettings;
}

export class InitSettingsCommand extends BaseStudioMasterCommand {
  execute() {
    const configPath = path.join(this.config.settingsDirectory, "config.json");

    let config: IUserSettings;

    if (fs.existsSync(configPath)) {
      config = require(configPath);
    }

    this.masterStore.userSettings = addDefaults(config || {} as any);
    this.logger.info("Using settings: " + JSON.stringify(this.masterStore.userSettings, null, 2));
  }
}