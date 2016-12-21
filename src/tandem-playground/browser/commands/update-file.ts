import { OpenFileRequest } from "@tandem/editor/common";
import { URIProtocolProvider } from "@tandem/sandbox";
import { UpdateFileCacheRequest } from "tandem-playground/browser/messages";
import { BaseEditorPlaygroundBrowserCommand } from "./base";

export class UpdateFileCommand extends BaseEditorPlaygroundBrowserCommand {
  async execute({ uri, content }: UpdateFileCacheRequest) {
    this.logger.info(`Updating file ${uri}`);
    const protocol = await URIProtocolProvider.lookup(uri, this.kernel);
    await protocol.write(uri, content);
  }
}