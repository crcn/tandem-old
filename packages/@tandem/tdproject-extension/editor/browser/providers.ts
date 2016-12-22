import { StoreProvider } from "@tandem/common";
import { TDProjectExtensionStore } from "./stores";

export class TandemExtensionStoreProvider extends StoreProvider {
  static readonly ID = StoreProvider.getId("tdproject");
  constructor(readonly clazz: { new(): TDProjectExtensionStore }) {
    super("tdproject", clazz);
  }
  clone() {
    return new TandemExtensionStoreProvider(this.clazz);
  }
}

 