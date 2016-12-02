import { createSingletonProviderClass, Injector, IProvider, StoreProvider } from "@tandem/common"; 
import { HTMLExtensionStore } from "../stores";


export class HTMLExtensionStoreProvider extends StoreProvider {
  static readonly NAME = "htmlExtensionStore";
  static readonly ID = StoreProvider.getId(HTMLExtensionStoreProvider.NAME);
  constructor(clazz: { new(): HTMLExtensionStore }) {
    super(HTMLExtensionStoreProvider.NAME, clazz);
  }
}

