import * as fsa from "fs-extra";
import { BaseStudioServerCommand } from "./base";

export class InitSettingsDirectoryCommand extends BaseStudioServerCommand {
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