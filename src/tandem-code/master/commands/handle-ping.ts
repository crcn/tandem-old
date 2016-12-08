import { BaseStudioMasterCommand } from "./base";

export class HandlePingCommand extends BaseStudioMasterCommand {
  execute() {
    return true;
  }
}