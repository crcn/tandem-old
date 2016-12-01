import { Store } from "@tandem/editor/browser/models";
import { IMessage } from "@tandem/mesh";
import { BaseCommand, inject } from "@tandem/common";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";

export abstract class BaseEditorBrowserCommand extends BaseCommand {
  @inject(EditorStoreProvider.ID)
  protected readonly store: Store;
  
  abstract execute(message: IMessage);
}