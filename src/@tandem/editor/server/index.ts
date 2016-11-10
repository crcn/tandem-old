import { DSProvider } from "./providers";
import { IActor, Injector } from "@tandem/common";
import { ConsoleLogService } from "@tandem/editor/common";
import { IEdtorServerConfig } from "./config";
import { createCoreApplicationProviders, ApplicationServiceProvider } from "@tandem/core";
import { DependencyGraphStrategyProvider, WebpackDependencyGraphStrategy, ProtocolURLResolverProvider, WebpackProtocolResolver } from "@tandem/sandbox";

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

export function createEditorServiceProviders(config: IEdtorServerConfig, dataStore?: IActor) {
  return [
    createCommonEditorProviders(),
    createCoreApplicationProviders(config),
    new DSProvider(dataStore),

    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
    new ProtocolURLResolverProvider("webpack", WebpackProtocolResolver),

    // services
    new ApplicationServiceProvider("ds", DSService),
    new ApplicationServiceProvider("file", FileService),
    new ApplicationServiceProvider("sock", SockService),
    new ApplicationServiceProvider("project", ProjectService),
    new ApplicationServiceProvider("browser", BrowserService),
    new ApplicationServiceProvider("resolver", ResolverService),
  ];
}

export * from "./data-stores";
export * from "./config";
export * from "./services";