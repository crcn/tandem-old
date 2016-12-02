import { BaseStudioServerCommand } from "./base";
import { dialog } from "electron";

export class SelectDirectoryCommand extends BaseStudioServerCommand {
  execute() {
    return dialog.showOpenDialog({
      properties: ["openDirectory"]
    })[0];
  }
}