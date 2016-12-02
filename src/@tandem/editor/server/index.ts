import { DSProvider } from "./providers";
import { ImportFileRequest } from "@tandem/editor/common";
import { ImportFileCommand } from "./commands";
import { IEdtorServerConfig } from "./config";
import { ApplicationServiceProvider } from "@tandem/core";
import { Injector, CommandFactoryProvider } from "@tandem/common";
import { IStreamableDispatcher, MemoryDataStore } from "@tandem/mesh";
import { ProtocolURLResolverProvider, WebpackProtocolResolver } from "@tandem/sandbox";
import { ConsoleLogService, ReceiverService, FileImporterProvider } from "@tandem/editor/worker";

import {
  DSService,
  FileService,
  SockService,
  StdinService,
  BrowserService,
  ResolverService,
} from "./services";

import { createCommonEditorProviders } from "../common";


export function createEditorServerProviders(config: IEdtorServerConfig, dataStore?: IStreamableDispatcher<any>) {
  return [
    createCommonEditorProviders(config),
    new DSProvider(dataStore || new MemoryDataStore()),

    // commands
    new CommandFactoryProvider(ImportFileRequest.IMPORT_FILE, ImportFileCommand),

    // services
    new ApplicationServiceProvider("ds", DSService),
    new ApplicationServiceProvider("file", FileService),
    new ApplicationServiceProvider("sock", SockService),
    new ApplicationServiceProvider("browser", BrowserService),
    new ApplicationServiceProvider("resolver", ResolverService),
  ];
}

export * from "./config";
export * from "./services";
export * from "../worker";