import { Injector } from "@tandem/common";
import { RemoteBrowserService } from "./remote-browser";
import { ApplicationServiceProvider } from "@tandem/core";

export function createSyntheticBrowserWorkerProviders() {
  return [
    new ApplicationServiceProvider("remoteBrowserRenderer", RemoteBrowserService)
  ];
}

export * from "./dom";
export * from "./browser";
export * from "./renderers";
export * from "./providers";
export * from "./sandbox";
export * from "./location";
export * from "./actions";
export * from "./remote-browser";

