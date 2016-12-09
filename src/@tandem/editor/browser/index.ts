import "./styles";

import { IFileResolver } from "@tandem/sandbox";
import { EditorRouteNames } from "./constants";
import { IEditorBrowserConfig } from "./config";
import { createCoreApplicationProviders, ApplicationServiceProvider } from "@tandem/core";

import { 
  Injector, 
  IProvider,
  LoadApplicationRequest,
  CommandFactoryProvider, 
  ApplicationReadyMessage,
  InitializeApplicationRequest, 
} from "@tandem/common";

import { 
  AlertMessage, 
  RedirectRequest, 
  ToggleSettingRequest,
  RemoveSelectionRequest, 
  ToggleStageToolsRequest,
  AddSyntheticObjectRequest, 
} from "./messages";

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

import { EditorStore } from "./stores";
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
  ToggleSettingCommand,
  OpenWorkspaceCommand,
  SetReadyStatusCommand,
  RemoveSelectionCommand, 
  toggleStageToolsCommand,
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

export function createEditorBrowserProviders(config: IEditorBrowserConfig,fileResolverClass?: { new(): IFileResolver }) {
  return [

    createCommonEditorProviders(config, fileResolverClass),
    
    // routes
    new RouteFactoryProvider(EditorRouteNames.WORKSPACE, "/workspace", WorkspaceRouteHandler),

    // pages
    new PageFactoryProvider(EditorRouteNames.WORKSPACE, WorkspaceComponent),

    // commands
    new CommandFactoryProvider(AlertMessage.ALERT, AlertCommand),
    new CommandFactoryProvider(ToggleSettingRequest.TOGGLE_SETTING, ToggleSettingCommand),
    new CommandFactoryProvider(ToggleStageToolsRequest.TOGGLE_STAGE_TOOLS, toggleStageToolsCommand),
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
    // new ApplicationServiceProvider("keyBindings", GlobalKeyBindingService),

    // stage tool components
    new StageToolComponentFactoryProvider("selector", "pointer", SelectorStageToolComponent),
    new ReactComponentFactoryProvider("components/tools/pointer/drag-select", DragSelectStageToolComponent as any),
    new ReactComponentFactoryProvider("components/tools/pointer/grid", GridStageToolComponent),
    new ReactComponentFactoryProvider("components/tools/insert/size", InsertStageToolComponent),
    new StageToolComponentFactoryProvider("selectable", "pointer", SelectableStageToolComponent),

    // pane components
    new DocumentPaneComponentFactoryProvider("layers", LayersPaneComponent),

    new EditorStoreProvider(EditorStore),

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
export * from "./commands/base";
export * from "./menus";
