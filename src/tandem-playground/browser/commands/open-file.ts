import { OpenFileRequest } from "@tandem/editor/common";
import { URIProtocolProvider } from "@tandem/sandbox";
import { BaseEditorPlaygroundBrowserCommand } from "./base";

export class OpenFileCommand extends BaseEditorPlaygroundBrowserCommand {

  async execute({ uri }: OpenFileRequest) {
    const protocol = await URIProtocolProvider.lookup(uri, this.kernel);
    const { type, content } = await protocol.read(uri);
    this.playgroundStore.textEditor.show = true;
    this.playgroundStore.textEditor.currentFile = { type, content, uri };
  }
}