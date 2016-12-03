import { HTMLExtensionStore } from "../stores";
import { ReactComponentFactoryProvider } from "@tandem/editor/browser/providers";
import { createSingletonProviderClass, Injector, IProvider, StoreProvider } from "@tandem/common"; 


export class HTMLExtensionStoreProvider extends StoreProvider {
  static readonly NAME = "htmlExtensionStore";
  static readonly ID = StoreProvider.getId(HTMLExtensionStoreProvider.NAME);
  constructor(clazz: { new(): HTMLExtensionStore }) {
    super(HTMLExtensionStoreProvider.NAME, clazz);
  }
}

export class ElementLayerLabelProvider extends ReactComponentFactoryProvider {
  static readonly NS = "elementLayerLabels";

  constructor(readonly tagName: string, readonly clazz: any) {
    super(ElementLayerLabelProvider.getId(tagName), clazz);
  }

  static getId(name: string) {
    return [this.NS, name].join("/");
  }

  static find(tagName: string, injector: Injector) {
    return injector.query<ElementLayerLabelProvider>(this.getId(tagName));
  }
}