import "./styles";

import { IEditorBrowserConfig } from "./config";
import { IFileSystem, IFileResolver } from "@tandem/sandbox";
import { createCoreApplicationProviders, ApplicationServiceProvider } from "@tandem/core";
import { Injector, CommandFactoryProvider, InitializeRequest, IProvider } from "@tandem/common";
import { AlertMessage, RemoveSelectionRequest } from "./messages";
import {
  StoreProvider,
  ReactComponentFactoryProvider,
  StageToolComponentFactoryProvider,
  LayerLabelComponentFactoryProvider,
  DocumentPaneComponentFactoryProvider,
} from "./providers";

import { keyBindingsProviders } from "./key-bindings";

import {
  LayersPaneComponent,
  GridStageToolComponent,
  InsertStageToolComponent,
  SelectorStageToolComponent,
  DragSelectStageToolComponent,
  SelectableStageToolComponent,
} from "./components";

import { Store } from "./models";

import { createCommonEditorProviders, ConsoleLogService, ReceiverService } from "../common";
import { OpenCWDCommand, AlertCommand, RemoveSelectionCommand } from "./commands";

import {
  DNDService,
  ServerService,
  SettingsService,
  ClipboardService,
  ComponentService,
  WorkspaceService,
  GlobalKeyBindingService,
} from "./services";

export function createEditorBrowserProviders(config: IEditorBrowserConfig, fileSystemClass?: { new(): IFileSystem }, fileResolverClass?: { new(): IFileResolver }) {
  return [
    ...keyBindingsProviders,
    createCommonEditorProviders(config, fileSystemClass, fileResolverClass),

    // commands
    new CommandFactoryProvider(AlertMessage.ALERT, AlertCommand),
    new CommandFactoryProvider(InitializeRequest.INITIALIZE, OpenCWDCommand),
    new CommandFactoryProvider(RemoveSelectionRequest.REMOVE_SELECTION, RemoveSelectionCommand),

    // services
    new ApplicationServiceProvider("dnd", DNDService),
    new ApplicationServiceProvider("server", ServerService),
    new ApplicationServiceProvider("settings", SettingsService),
    new ApplicationServiceProvider("clipboard", ClipboardService),
    new ApplicationServiceProvider("component", ComponentService),
    new ApplicationServiceProvider("workspace", WorkspaceService),
    new ApplicationServiceProvider("keyBindings", GlobalKeyBindingService),

    // stage tool components
    new StageToolComponentFactoryProvider("selector", "pointer", SelectorStageToolComponent),
    new ReactComponentFactoryProvider("components/tools/pointer/drag-select", DragSelectStageToolComponent as any),
    new ReactComponentFactoryProvider("components/tools/pointer/grid", GridStageToolComponent),
    new ReactComponentFactoryProvider("components/tools/insert/size", InsertStageToolComponent),
    new StageToolComponentFactoryProvider("selectable", "pointer", SelectableStageToolComponent),

    // pane components
    new DocumentPaneComponentFactoryProvider("layers", LayersPaneComponent),

    new StoreProvider(Store),

    // pointerToolProvider
  ];
}

export * from "./messages";
export * from "./config";
export * from "./collections";
export * from "./components";
export * from "./constants";
export * from "./providers";
export * from "./key-bindings";
export * from "./models";
export * from "./services";
export * from "../common";