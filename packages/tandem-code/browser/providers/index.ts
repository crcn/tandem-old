import { TandemStudioBrowserStore } from "../stores";
import { StoreProvider, ClassFactoryProvider, Kernel } from "@tandem/common";

export class TandemStudioBrowserStoreProvider extends StoreProvider {
  static readonly NAME = "studioBrowserStore";
  static readonly ID = TandemStudioBrowserStoreProvider.getId(TandemStudioBrowserStoreProvider.NAME);
  constructor(clazz: { new(): TandemStudioBrowserStore }) {
    super(TandemStudioBrowserStoreProvider.NAME, clazz);
  }
} 
