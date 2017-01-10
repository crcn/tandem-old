import { StoreProvider } from "@tandem/common";
import { CollaborateRootStore } from "../stores";

export class RootCollaboratorStoreProvider extends StoreProvider {
  static readonly ID = StoreProvider.getId("collaborator");
  constructor(readonly clazz: { new(): CollaborateRootStore }) {
    super("collaborator", CollaborateRootStore);
  }
  clone()  {
    return new RootCollaboratorStoreProvider(this.clazz);
  }
}