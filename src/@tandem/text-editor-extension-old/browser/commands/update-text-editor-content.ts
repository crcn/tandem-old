import { BaseEditorPlaygroundBrowserCommand } from "./base";
import { FileCacheItemUpdatedMessage } from "../messages";

export class UpdateTextEditorContentCommand extends BaseEditorPlaygroundBrowserCommand {
  async execute({ item }: FileCacheItemUpdatedMessage) {
    console.log(item.updatedAt, this.playgroundStore.textEditor.currentMtime);
    if (item.sourceUri === this.playgroundStore.textEditor.currentFile.uri && item.updatedAt > this.playgroundStore.textEditor.currentMtime) {
      this.playgroundStore.textEditor.currentFile.content = (await item.read()).content;
    }
  }
}