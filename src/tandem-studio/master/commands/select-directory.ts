import {  BaseStudioMasterCommand } from "./base";
import { dialog } from "electron";

export class SelectDirectoryCommand extends  BaseStudioMasterCommand {
  execute() {
    return dialog.showOpenDialog({
      properties: ["openDirectory"]
    })[0];
  }
}