import { createSingletonProviderClass, Injector, IProvider } from "@tandem/common"; 
import { HTMLExtensionStore } from "../models";


export const HTMLExtensionStoreProvider = createSingletonProviderClass<HTMLExtensionStore>("htmlExtensionStore");
