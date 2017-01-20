import { BaseStudioMasterCommand } from "./base";
import { ExecuteCommandRequest } from "tandem-code/common";
import { exec } from "child_process";

export class ExecuteCommandCommand extends BaseStudioMasterCommand {
  execute({ command }: ExecuteCommandRequest) {
    this.logger.info("executing " + command);
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err || /\w+/.test(stderr)) return reject(err || new Error(stderr));
        resolve();
      });
    });
  }
}