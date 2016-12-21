import { StoreProvider } from "@tandem/common";
import { RootPlaygroundBrowserStore } from "../stores";

export class PlaygroundBrowserStoreProvider extends StoreProvider {
  static ID = StoreProvider.getId("playgroundBrowser");
  constructor(readonly clazz: { new(): RootPlaygroundBrowserStore }) {
    super("playgroundBrowser", clazz);
  }
  clone() {
    return new PlaygroundBrowserStoreProvider(this.clazz);
  }
}