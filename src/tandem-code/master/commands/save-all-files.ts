import { BaseStudioMasterCommand } from "./base";
import { FileCache, getAllUnsavedFiles, URIProtocolProvider } from "@tandem/sandbox";

export class SaveAllFilesCommand extends BaseStudioMasterCommand {
  async execute() {
    for (const item of (await getAllUnsavedFiles(this.kernel))) {
      const { content } = await item.read();
      const protocol = URIProtocolProvider.lookup(item.sourceUri, this.kernel);
      await protocol.write(item.sourceUri, content);
    }
  }
  async loadUnsavedFiles() {
    
  }
}