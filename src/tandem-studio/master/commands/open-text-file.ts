import { BaseStudioMasterCommand } from "./base";
import { readOneChunk } from "@tandem/mesh";
import { spawn } from "child_process";
import { OpenFileRequest, SetCurrentFileRequest } from "@tandem/editor/common";

export class OpenTextFileCommand extends BaseStudioMasterCommand {
  async execute(request: OpenFileRequest) {

    const opened = (await readOneChunk(this.bus.dispatch(new SetCurrentFileRequest(request.filePath, request.selection)))).value;

    if (!opened) {
      spawn(this.masterStore.userSettings.textEditor.bin, [request.filePath]);
    }
  }
}