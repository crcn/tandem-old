import { IDispatcher } from "@tandem/mesh";
import { ImportFileRequest } from "@tandem/editor/common";
import { Injector, CommandFactoryProvider, LoadRequest } from "@tandem/common";
import { ConsoleLogService, ReceiverService } from "@tandem/editor/common";
import { RemoteFileSystem, RemoteFileResolver } from "@tandem/sandbox";
import { createCoreApplicationProviders, ApplicationServiceProvider } from "@tandem/core";
import { DependencyGraphStrategyProvider, WebpackDependencyGraphStrategy, ProtocolURLResolverProvider, WebpackProtocolResolver } from "@tandem/sandbox";

import { IEditorWorkerConfig } from "./config";
import { LoadProjectConfigCommand } from "./commands";
import { createCommonEditorProviders } from "../common";

export function createEditorWorkerProviders(config:  IEditorWorkerConfig, dataStore?: IDispatcher<any, any>) {
  return [
    createCommonEditorProviders(),
    createCoreApplicationProviders(config, RemoteFileSystem, RemoteFileResolver),

    new CommandFactoryProvider(LoadRequest.LOAD,  LoadProjectConfigCommand),

    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
    new ProtocolURLResolverProvider("webpack", WebpackProtocolResolver),
  ];
}

export * from "./config";
export * from "./providers";
export * from "../common";