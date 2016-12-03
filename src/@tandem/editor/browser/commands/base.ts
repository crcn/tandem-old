import { EditorStore } from "@tandem/editor/browser/stores";
import { IMessage } from "@tandem/mesh";
import { BaseCommand, inject } from "@tandem/common";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";

export abstract class BaseEditorBrowserCommand extends BaseCommand {
  
  @inject(EditorStoreProvider.ID)
  protected readonly editorStore: EditorStore;
  
  abstract execute(message: IMessage);
}