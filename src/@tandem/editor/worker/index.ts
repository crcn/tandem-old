import { IDispatcher } from "@tandem/mesh";
import { AddFilesAction } from "@tandem/editor/common/actions";
import { Injector, CommandFactoryProvider } from "@tandem/common";
import { ConsoleLogService, ReceiverService } from "@tandem/editor/common";
import { RemoteFileSystem, RemoteFileResolver } from "@tandem/sandbox";
import { createCoreApplicationProviders, ApplicationServiceProvider } from "@tandem/core";
import { DependencyGraphStrategyProvider, WebpackDependencyGraphStrategy, ProtocolURLResolverProvider, WebpackProtocolResolver } from "@tandem/sandbox";

import { IEditorWorkerConfig } from "./config";
import { createCommonEditorProviders } from "../common";

export function createEditorWorkerProviders(config:  IEditorWorkerConfig, dataStore?: IDispatcher<any, any>) {
  return [
    createCommonEditorProviders(),
    createCoreApplicationProviders(config, RemoteFileSystem, RemoteFileResolver),

    // commands
    // new CommandFactoryProvider(AddFilesAction.ADD_FILES, AddFilesCommand),

    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
    new ProtocolURLResolverProvider("webpack", WebpackProtocolResolver),
  ];
}

export * from "./config";