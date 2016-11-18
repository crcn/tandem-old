import { Store } from "@tandem/editor/browser/models";
import { IEditable, ISyntheticObject, RemoveEditChange, ApplyFileEditRequest } from "@tandem/sandbox";
import { StoreProvider } from "@tandem/editor/browser/providers";
import { ICommand, inject, PrivateBusProvider, IBrokerBus } from "@tandem/common";
import { RemoveSelectionRequest } from "@tandem/editor/browser/actions";

export class RemoveSelectionCommand implements ICommand {

  @inject(StoreProvider.ID)
  private _store: Store;

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;

  async execute(request: RemoveSelectionRequest) {

    const changes = [];

    for (const selection of this._store.workspace.selection as Array<ISyntheticObject & IEditable>) {
      if (!(selection.createEdit)) continue;
      changes.push(new RemoveEditChange(selection));
    }

    await this._bus.dispatch(new ApplyFileEditRequest(changes));
  }
}

