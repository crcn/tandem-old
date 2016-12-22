import { OpenFileRequest } from "@tandem/editor/common";
import { URIProtocolProvider, getCacheUri } from "@tandem/sandbox";
import { BaseEditorPlaygroundBrowserCommand } from "./base";

export class OpenFileCommand extends BaseEditorPlaygroundBrowserCommand {

  async execute({ uri }: OpenFileRequest) {
    const cacheUri = getCacheUri(uri);
    const protocol = await URIProtocolProvider.lookup(cacheUri, this.editorStore.workspace.envKernel);
    const result = await protocol.read(cacheUri);
    if (!result) {
      return alert(`${uri} could not be found.`);
    }
    const { type, content } = result;
    this.playgroundStore.textEditor.show = true;
    this.playgroundStore.textEditor.currentFile = { type, content, uri };
  }
}