import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import {  BaseStudioMasterCommand } from "./base";
import { OpenNewWorkspaceRequest } from "tandem-studio/common";

function fileExists(filePath: string) {
  return fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory();
}

export class CLIOpenWorkspaceCommand extends  BaseStudioMasterCommand {
  execute(): any {
    let filePath = this.config.argv._[0];

    // scan the CWD for any tandem files
    if (filePath != null && !fileExists(filePath)) {

      filePath = filePath.replace(/^\./, process.cwd()).replace(/^~/, process.env.HOME);

      if (!fileExists(filePath)) {
        filePath = glob.sync(path.join(filePath, `{${this.config.projectFileExtensions.map(ext => `*.${ext}`).join(",")}}`)).find((filePath) => {
          return true;
        });
      }
    }

    // open new workspace anyways -- the user will be prompted to open a file from there
    if (!filePath) {
      return this.bus.dispatch(new  OpenNewWorkspaceRequest(undefined));
    }

    if (filePath.substr(0, 1) !== "/") {
      filePath = path.join(process.cwd(), filePath);
    }

    if (!fileExists(filePath)) {
      this.logger.error(`Cannot open ${filePath}: File does not exist.`);
      return;
    }

    return this.bus.dispatch(new OpenNewWorkspaceRequest(filePath));
  }
} 

