import fsa = require("fs-extra");
import { BaseStudioMasterCommand } from "./base";

export class InitSettingsDirectoryCommand extends  BaseStudioMasterCommand {
  execute() {
    try {
      fsa.removeSync(this.config.tmpDirectory)
    } catch(e) {
    }
    try {
      fsa.mkdirpSync(this.config.tmpDirectory);
      fsa.mkdirpSync(this.config.cacheDirectory);
    } catch(e) {

    }
  }
}