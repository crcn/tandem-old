import { Injector } from "@tandem/common";
import { IEdtorServerConfig } from "./config";
import { createCoreApplicationDependencies, ApplicationServiceProvider } from "@tandem/core";

import {
  DSService,
  FileService,
  SockService,
  StdinService,
  ProjectService,
  BrowserService,
  ResolverService,
} from "./services";

import { createCommonEditorDependencies } from "../common";

export function concatEditorServerDependencies(dependencies: Injector, config: IEdtorServerConfig) {
  return new Injector(
    dependencies,
    createCommonEditorDependencies(),
    createCoreApplicationDependencies(config),

    // services
    new ApplicationServiceProvider("ds", DSService),
    new ApplicationServiceProvider("file", FileService),
    new ApplicationServiceProvider("sock", SockService),
    new ApplicationServiceProvider("stdin", StdinService),
    new ApplicationServiceProvider("project", ProjectService),
    new ApplicationServiceProvider("browser", BrowserService),
    new ApplicationServiceProvider("resolver", ResolverService),
  );
}

export * from "./config";
export * from "./services";