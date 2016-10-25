import { Dependencies } from "@tandem/common";
import { ComponentService } from "./services";
import { IEditorBrowserConfig } from "./config";
import { IFileSystem, IFileResolver } from "@tandem/sandbox";
import { concatCoreDependencies, ApplicationServiceDependency } from "../core";

export function concatEditorBrowserDependencies(dependencies: Dependencies, config: IEditorBrowserConfig, fileSystem?: IFileSystem, fileResolver?: IFileResolver) {
  return new Dependencies(
    concatCoreDependencies(dependencies, config, fileSystem, fileResolver),

    // services
    new ApplicationServiceDependency("rootComponentRenderer", ComponentService)
  );
}

export * from "./actions";
export * from "./config";
export * from "./collections";
export * from "./components";
export * from "./constants";
export * from "./dependencies";
export * from "./key-bindings";
export * from "./models";
export * from "./services";
export * from "./application";
export * from "../core";