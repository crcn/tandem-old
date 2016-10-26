import { Dependencies } from "@tandem/common";
import { RemoteBrowserService } from "./remote-browser";
import { ApplicationServiceDependency } from "@tandem/core";

export function createSyntheticBrowserWorkerDependencies() {
  return [
    new ApplicationServiceDependency("remoteBrowserRenderer", RemoteBrowserService)
  ];
}

export * from "./dom";
export * from "./browser";
export * from "./renderers";
export * from "./dependencies";
export * from "./sandbox";
export * from "./location";
export * from "./actions";
export * from "./remote-browser";

