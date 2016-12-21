import { OpenFileRequest } from "@tandem/editor/common";
import { URIProtocolProvider, getCacheUri } from "@tandem/sandbox";
import { UpdateFileCacheRequest } from "tandem-playground/browser/messages";
import { BaseEditorPlaygroundBrowserCommand } from "./base";

export class UpdateFileCommand extends BaseEditorPlaygroundBrowserCommand {
  async execute({ uri, content }: UpdateFileCacheRequest) {
    this.logger.info(`Updating file ${uri}`);
    const cacheUri = getCacheUri(uri);
    const protocol = await URIProtocolProvider.lookup(cacheUri, this.editorStore.workspace.envKernel);
    await protocol.write(cacheUri, content);
  }
}