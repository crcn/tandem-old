// TODO - move this to tandem-starters repository

import fs =  require("fs");
import path =  require("path");
import { BaseProjectStarter } from "./base";
import stripIndent = require("strip-indent");

const FILES = {
  "workspace.tandem": stripIndent(`
    <tandem>
    </tandem>
  `)
};

export class BlankProjectStarter extends BaseProjectStarter {
  async start(directoryPath: string) {

    for (const fileName in FILES) {
      fs.writeFileSync(path.join(directoryPath, fileName), FILES[fileName]);
    }

    return {
      workspaceFilePath: path.join(directoryPath, "workspace.tandem")
    }
  }
}