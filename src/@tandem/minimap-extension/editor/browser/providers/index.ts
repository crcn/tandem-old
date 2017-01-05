import { StoreProvider } from "@tandem/common";
import { MinimapExtensionRootStore } from "../stores";

export class MinimapRootStoreProvider extends StoreProvider {
  static readonly ID = StoreProvider.getId("minimap");
  constructor(readonly clazz: { new():  MinimapExtensionRootStore }) {
    super(MinimapRootStoreProvider.ID, clazz);
  }
  clone() {
    return new MinimapRootStoreProvider(this.clazz);
  }
}