import { MimeTypeProvider } from "@tandem/common";
import { BundlerLoaderFactoryProvider } from "@tandem/sandbox";
import { createVueSandboxDependencies } from "@tandem/vue-extension/sandbox";
import { createCoreVueDependencies } from "@tandem/vue-extension/core";

export const createVueWorkerDependencies = () => {
  return [
    ...createVueSandboxDependencies(),
    ...createCoreVueDependencies()
  ];
}

export * from "../../core";