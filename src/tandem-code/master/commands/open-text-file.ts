import { BaseStudioMasterCommand } from "./base";
import { readOneChunk } from "@tandem/mesh";
import { spawn } from "child_process";
import { OpenFileRequest, SetCurrentFileRequest } from "@tandem/editor/common";

export class OpenTextFileCommand extends BaseStudioMasterCommand {
  async execute(request: OpenFileRequest) {
    this.logger.debug(`Opening text document: ${request.uri}`);

    let opened;

    try {
      opened = (await readOneChunk(this.bus.dispatch(new SetCurrentFileRequest(request.uri, request.selection)))).value;
    } catch(e) {
      this.logger.error(e.stack);
    }

    this.logger.debug(`Received ${opened} response from text editor`);

    if (!opened) {
      this.logger.debug(`Opening new text editor session`);
      spawn(this.masterStore.userSettings.textEditor.bin, [...(this.masterStore.userSettings.textEditor.args || []), request.uri.replace("file://", "")]);
    }
  }
}