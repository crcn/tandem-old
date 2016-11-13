import { DSProvider } from "./providers";
import { AddFilesAction } from "@tandem/editor/common/actions";
import { AddFilesCommand } from "./commands";
import { IEdtorServerConfig } from "./config";
import { ConsoleLogService, ReceiverService } from "@tandem/editor/common";
import { IActor, Injector, CommandFactoryProvider } from "@tandem/common";
import { createCoreApplicationProviders, ApplicationServiceProvider } from "@tandem/core";
import { DependencyGraphStrategyProvider, WebpackDependencyGraphStrategy, ProtocolURLResolverProvider, WebpackProtocolResolver } from "@tandem/sandbox";

import * as MemoryDS from "mesh-memory-ds-bus";

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

export function createEditorServerProviders(config: IEdtorServerConfig, dataStore?: IActor) {
  return [
    createCommonEditorProviders(),
    createCoreApplicationProviders(config),
    new DSProvider(dataStore || new MemoryDS()),

    // commands
    new CommandFactoryProvider(AddFilesAction.ADD_FILES, AddFilesCommand),

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