// TODO - move this to tandem-starters repository

import * as fs from "fs";
import * as path from "path";
import { BaseProjectStarter } from "./base";
import * as stripIndent from "strip-indent";

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