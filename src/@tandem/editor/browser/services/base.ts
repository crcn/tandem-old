import { CoreApplicationService } from "@tandem/core";
import { inject } from "@tandem/common";
import { EditorStore } from "@tandem/editor/browser/stores";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";

export abstract class BaseEditorApplicationService<T> extends CoreApplicationService<T> {
  @inject(EditorStoreProvider.ID)
  protected editorStore: EditorStore;
}