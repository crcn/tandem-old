import { Store } from "../models";
import { createSingletonProviderClass, Injector, IProvider } from "@tandem/common";

export const ServerStoreProvider = createSingletonProviderClass<Store>("serverStore");