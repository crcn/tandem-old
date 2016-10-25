import { Dependencies } from "@tandem/common";
import { IEdtorServerConfig } from "./config";
import { concatCoreApplicationDependencies, ApplicationServiceDependency } from "@tandem/core";

import {
  DSService,
  FileService,
  SockService,
  StdinService,
  ProjectService,
  BrowserService,
  ResolverService,
} from "./services";

export function concatEditorServerDependencies(dependencies: Dependencies, config: IEdtorServerConfig) {
  return new Dependencies(
    concatCoreApplicationDependencies(dependencies, config),

    // services
    new ApplicationServiceDependency("ds", DSService),
    new ApplicationServiceDependency("file", FileService),
    new ApplicationServiceDependency("sock", SockService),
    new ApplicationServiceDependency("stdin", StdinService),
    new ApplicationServiceDependency("project", ProjectService),
    new ApplicationServiceDependency("browser", BrowserService),
    new ApplicationServiceDependency("resolver", ResolverService),
  );
}

export * from "./config";
export * from "./services";