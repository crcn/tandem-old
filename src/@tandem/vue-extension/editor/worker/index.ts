import { MimeTypeProvider } from "@tandem/common";
import { BundlerLoaderFactoryProvider } from "@tandem/sandbox";
import { createVueSandboxProviders } from "@tandem/vue-extension/sandbox";
import { createCoreVueProviders } from "@tandem/vue-extension/core";

export const createVueWorkerProviders = () => {
  return [
    ...createVueSandboxProviders(),
    ...createCoreVueProviders()
  ];
}

export * from "../../core";