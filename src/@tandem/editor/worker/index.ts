import { AddFilesAction } from "@tandem/editor/common/actions";
import { ConsoleLogService, ReceiverService } from "@tandem/editor/common";
import { IActor, Injector, CommandFactoryProvider } from "@tandem/common";
import { createCoreApplicationProviders, ApplicationServiceProvider } from "@tandem/core";
import { DependencyGraphStrategyProvider, WebpackDependencyGraphStrategy, ProtocolURLResolverProvider, WebpackProtocolResolver } from "@tandem/sandbox";

import { IEditorWorkerConfig } from "./config";
import { createCommonEditorProviders } from "../common";

export function createEditorWorkerProviders(config:  IEditorWorkerConfig, dataStore?: IActor) {
  return [
    createCommonEditorProviders(),
    createCoreApplicationProviders(config),

    // commands
    // new CommandFactoryProvider(AddFilesAction.ADD_FILES, AddFilesCommand),

    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
    new ProtocolURLResolverProvider("webpack", WebpackProtocolResolver),
  ];
}

export * from "./config";