import { Dependencies } from "@tandem/common";
import { RemoteBrowserService } from "./remote-browser";
import { ApplicationServiceDependency } from "@tandem/core";

export function createSyntheticBrowserDependencies(dependencies: Dependencies) {
  return new Dependencies(
    dependencies,
    new ApplicationServiceDependency("remoteBrowserRenderer", RemoteBrowserService)
  );
}

export * from "./dom";
export * from "./browser";
export * from "./renderers";
export * from "./dependencies";
export * from "./sandbox";
export * from "./location";
export * from "./actions";
export * from "./remote-browser";

