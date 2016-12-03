import { EditorStore } from "@tandem/editor/browser/stores";
import { IEditable, ISyntheticObject, ApplyFileEditRequest } from "@tandem/sandbox";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { ICommand, inject, PrivateBusProvider, IBrokerBus, RemoveMutation } from "@tandem/common";
import { RemoveSelectionRequest } from "@tandem/editor/browser/messages";

export class RemoveSelectionCommand implements ICommand {

  @inject(EditorStoreProvider.ID)
  private _store: EditorStore;

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;

  async execute(request: RemoveSelectionRequest) {

    const mutations = [];

    for (const selection of this._store.workspace.selection as Array<ISyntheticObject & IEditable>) {
      if (!(selection.createEdit)) continue;
      mutations.push(new RemoveMutation(selection));
    }

    await this._bus.dispatch(new ApplyFileEditRequest(mutations));
  }
}

