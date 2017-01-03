import "./styles";

import { IEditorBrowserConfig } from "./config";
import { EditorRouteNames, ContextMenuTypes } from "./constants";
import { IFileResolver, URIProtocolProvider } from "@tandem/sandbox";
import { createWebMenuItemClass, WebMenuItem, createKeyCommandMenuItemClass } from "./menus";

import { 
  Kernel, 
  IProvider,
  LoadApplicationRequest,
  CommandFactoryProvider, 
  ApplicationReadyMessage,
  ApplicationServiceProvider,
  InitializeApplicationRequest, 
  ApplicationConfigurationProvider,
} from "@tandem/common";

import { Workspace } from "./stores";


import { 
  AlertMessage, 
  RedirectRequest, 
  ToggleSettingRequest,
  RemoveSelectionRequest, 
  ToggleStageToolsRequest,
  AddSyntheticObjectRequest, 
  OpenLinkInNewWindowRequest,
  OpenLinkInThisWindowRequest,
} from "./messages";

import {
  PageFactoryProvider,
  EditorStoreProvider,
  RouteFactoryProvider,
  GlobalKeyBindingProvider,
  WebMenuItemFactoryProvider,
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

import { StreamProxyProtocol } from "./protocols";

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
  LoadAnonSession,
  LoadRouterCommand,
  ToggleSettingCommand,
  OpenWorkspaceCommand,
  SetReadyStatusCommand,
  RemoveSelectionCommand, 
  toggleStageToolsCommand,
  OpenLinkInNewWindowCommand,
  OpenLinkInThisWindowCommand,
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

const testContextMenuLink = (parent: WebMenuItem) => {
  if (parent.name !== ContextMenuTypes.SYNTHETIC_ELEMENT) return false;
  const workspace = parent.kernel.query(EditorStoreProvider.ID).value.workspace as Workspace;
  return workspace.selection.length && /^(a)$/i.test(workspace.selection[0].tagName);
};


export function createEditorBrowserProviders(config: IEditorBrowserConfig,fileResolverClass?: { new(): IFileResolver }) {
  return [

    new URIProtocolProvider(() => true, StreamProxyProtocol),

    ...keyBindingsProviders,

    createCommonEditorProviders(config, fileResolverClass),
    
    // routes
    new RouteFactoryProvider(EditorRouteNames.WORKSPACE, "/workspace/:projectId", WorkspaceRouteHandler),

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
    new CommandFactoryProvider(LoadApplicationRequest.LOAD, LoadAnonSession),
    new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, LoadRouterCommand),
    new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, OpenCWDCommand),
    new CommandFactoryProvider(OpenLinkInNewWindowRequest.OPEN_LINK_IN_NEW_WINDOW, OpenLinkInNewWindowCommand),
    new CommandFactoryProvider(OpenLinkInThisWindowRequest.OPEN_LINK_IN_THIS_WINDOW, OpenLinkInThisWindowCommand),

    // services
    new ApplicationServiceProvider("dnd", DNDService),
    new ApplicationServiceProvider("server", ServerService),
    new ApplicationServiceProvider("settings", SettingsService),
    new ApplicationServiceProvider("clipboard", ClipboardService),
    new ApplicationServiceProvider("component", ComponentService),
    new ApplicationServiceProvider("workspace", WorkspaceService),

    // stage tool components
    new StageToolComponentFactoryProvider("selector", "pointer", SelectorStageToolComponent as any),
    new ReactComponentFactoryProvider("components/tools/pointer/drag-select", DragSelectStageToolComponent as any),
    new ReactComponentFactoryProvider("components/tools/pointer/grid", GridStageToolComponent),
    new ReactComponentFactoryProvider("components/tools/insert/size", InsertStageToolComponent),
    new StageToolComponentFactoryProvider("selectable", "pointer", SelectableStageToolComponent),

    // pane components
    new DocumentPaneComponentFactoryProvider("layers", LayersPaneComponent),

    new EditorStoreProvider(EditorStore),

    // menu items
    new WebMenuItemFactoryProvider(ContextMenuTypes.SYNTHETIC_ELEMENT, "contextRoot", createWebMenuItemClass("rootsie")),
    
    new WebMenuItemFactoryProvider("openElementInNewWindow", testContextMenuLink, createKeyCommandMenuItemClass("Open Link in New Window", undefined, OpenLinkInNewWindowRequest)),
    new WebMenuItemFactoryProvider("openElementInThisWindow", testContextMenuLink, createKeyCommandMenuItemClass("Open Link in This Window", undefined, OpenLinkInThisWindowRequest))
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
export * from "./utils";