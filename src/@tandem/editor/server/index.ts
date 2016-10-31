import { Injector } from "@tandem/common";
import { IEdtorServerConfig } from "./config";
import { createCoreApplicationProviders, ApplicationServiceProvider } from "@tandem/core";

import {
  DSService,
  FileService,
  SockService,
  StdinService,
  ProjectService,
  BrowserService,
  ResolverService,
} from "./services";

import { createCommonEditorProviders } from "../common";

export function concatEditorServerProviders(injector: Injector, config: IEdtorServerConfig) {
  return new Injector(
    injector,
    createCommonEditorProviders(),
    createCoreApplicationProviders(config),

    // services
    new ApplicationServiceProvider("ds", DSService),
    new ApplicationServiceProvider("file", FileService),
    new ApplicationServiceProvider("sock", SockService),
    new ApplicationServiceProvider("project", ProjectService),
    new ApplicationServiceProvider("browser", BrowserService),
    new ApplicationServiceProvider("resolver", ResolverService),
  );
}

export * from "./config";
export * from "./services";