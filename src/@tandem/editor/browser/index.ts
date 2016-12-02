import "./styles";

import { RouteNames } from "./constants";
import { IEditorBrowserConfig } from "./config";
import { IFileSystem, IFileResolver } from "@tandem/sandbox";
import { createCoreApplicationProviders, ApplicationServiceProvider } from "@tandem/core";

import { 
  Injector, 
  IProvider,
  LoadApplicationRequest,
  CommandFactoryProvider, 
  ApplicationReadyMessage,
  InitializeApplicationRequest, 
} from "@tandem/common";

import { AlertMessage, RemoveSelectionRequest, RedirectRequest } from "./messages";
import {
  PageFactoryProvider,
  EditorStoreProvider,
  RouteFactoryProvider,
  GlobalKeyBindingProvider,
  ReactComponentFactoryProvider,
  StageToolComponentFactoryProvider,
  LayerLabelComponentFactoryProvider,
  DocumentPaneComponentFactoryProvider,
} from "./providers";

import { keyBindingsProviders } from "./key-bindings";

import {
  RootComponent,
  WorkspaceComponent,
  LayersPaneComponent,
  GridStageToolComponent,
  InsertStageToolComponent,
  SelectorStageToolComponent,
  DragSelectStageToolComponent,
  SelectableStageToolComponent,
} from "./components";

import { Store } from "./stores";
import { WorkspaceRouteHandler } from "./routes";

import { 
  ReceiverService, 
  ConsoleLogService, 
  OpenWorkspaceRequest, 
  createCommonEditorProviders, 
} from "../common";

import { 
  AlertCommand, 
  OpenCWDCommand, 
  RedirectCommand,
  LoadRouterCommand,
  OpenWorkspaceCommand,
  SetReadyStatusCommand,
  RemoveSelectionCommand, 
} from "./commands";

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
    
    // routes
    new RouteFactoryProvider(RouteNames.WORKSPACE, "/workspace", WorkspaceRouteHandler),

    // pages
    new PageFactoryProvider(RouteNames.WORKSPACE, WorkspaceComponent),

    // commands
    new CommandFactoryProvider(AlertMessage.ALERT, AlertCommand),
    new CommandFactoryProvider(RedirectRequest.REDIRECT, RedirectCommand),
    new CommandFactoryProvider(ApplicationReadyMessage.READY, SetReadyStatusCommand),
    new CommandFactoryProvider(OpenWorkspaceRequest.OPEN_WORKSPACE, OpenWorkspaceCommand),
    new CommandFactoryProvider(RemoveSelectionRequest.REMOVE_SELECTION, RemoveSelectionCommand),
    
    new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, LoadRouterCommand),

    new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, OpenCWDCommand),

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

    new EditorStoreProvider(Store),

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
export * from "./stores";
export * from "./services";
export * from "../common";
export * from"./commands/base";
