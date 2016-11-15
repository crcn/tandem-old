import { DSProvider } from "./providers";
import { AddFilesAction } from "@tandem/editor/common/actions";
import { AddFilesCommand } from "./commands";
import { IEdtorServerConfig } from "./config";
import { Injector, CommandFactoryProvider } from "@tandem/common";
import { ConsoleLogService, ReceiverService } from "@tandem/editor/common";
import { IStreamableDispatcher, MemoryDataStore } from "@tandem/mesh";
import { ProtocolURLResolverProvider, WebpackProtocolResolver } from "@tandem/sandbox";
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

export function createEditorServerProviders(config: IEdtorServerConfig, dataStore?: IStreamableDispatcher<any>) {
  return [
    createCommonEditorProviders(),
    createCoreApplicationProviders(config),
    new DSProvider(dataStore || new MemoryDataStore()),

    // commands
    new CommandFactoryProvider(AddFilesAction.ADD_FILES, AddFilesCommand),

    // services
    new ApplicationServiceProvider("ds", DSService),
    new ApplicationServiceProvider("file", FileService),
    new ApplicationServiceProvider("sock", SockService),
    new ApplicationServiceProvider("project", ProjectService),
    new ApplicationServiceProvider("browser", BrowserService),
    new ApplicationServiceProvider("resolver", ResolverService),
  ];
}

export * from "./config";
export * from "./services";