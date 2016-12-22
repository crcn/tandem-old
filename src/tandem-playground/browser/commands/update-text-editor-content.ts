import { BaseEditorPlaygroundBrowserCommand } from "./base";
import { FileCacheItemUpdatedMessage } from "../messages";

export class UpdateTextEditorContentCommand extends BaseEditorPlaygroundBrowserCommand {
  async execute({ item }: FileCacheItemUpdatedMessage) {
    if (item.sourceUri === this.playgroundStore.textEditor.currentFile.uri) {
      this.playgroundStore.textEditor.currentFile.content = (await item.read()).content;
    }
  }
}