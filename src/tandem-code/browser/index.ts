import "reflect-metadata";

import path =  require("path");

declare let __webpack_public_path__: any;


__webpack_public_path__ = `${location.protocol}//${location.host ? location.host + "/" : ""}${path.dirname(location.pathname)}/`;

import Url =  require("url");
import { EditorFamilyType } from "@tandem/editor/common";
import { TandemStudioBrowserStore } from "./stores";
import { createTextEditorProviders } from "@tandem/text-editor-extension/browser";
import { InstallCommandLineToolsRequest } from "tandem-code/common";

import { 
  SettingKeys,
  WebMenuItem, 
  SaveAllRequest,
  ContextMenuTypes,
  createWebMenuItemClass, 
  ToggleStageToolsRequest,
  createMenuSeparatorClass, 
  WebMenuItemFactoryProvider, 
  createKeyCommandMenuItemClass, 
  createToggleSettingRequestClass,
} from "@tandem/editor/browser";

import { createSyntheticHTMLProviders } from "@tandem/synthetic-browser";
import { createHTMLEditorWorkerProviders } from "@tandem/html-extension/editor/worker";
import { TandemStudioBrowserStoreProvider } from "./providers";
import { createHTMLEditorBrowserProviders } from "@tandem/html-extension/editor/browser";
import { createTDProjectEditorWorkerProviders } from "@tandem/tdproject-extension/editor/worker";
import { createTDProjectEditorBrowserProviders } from "@tandem/tdproject-extension/editor/browser";
import { createCollaborateExtensionBrowserProviders } from "@tandem/collaborate-extension/editor/browser";

import { OpenRequest } from "./messages";

import { 
  Kernel, 
  LogLevel, 
  ServiceApplication,
  LoadApplicationRequest, 
  CommandFactoryProvider, 
  ApplicationReadyMessage,
  InitializeApplicationRequest, 
} from "@tandem/common";

import { WelcomeRouteHandler } from "./routes";

import { 
  ZoomInRequest,
  ZoomOutRequest,
  EditorRouteNames,
  DidRedirectMessage,
  PageFactoryProvider, 
  IEditorBrowserConfig, 
  RouteFactoryProvider,
  RemoveSelectionRequest,
  OpenContextMenuRequest,
  createCommonEditorProviders, 
  createEditorBrowserProviders, 
} from "@tandem/editor/browser";

import {StudioRouteNames } from "./constants";
import { WelcomeComponent } from "./components";
import { 
  OpenCommand,
  SetMenuCommand,
  LoadHelpOptionsCommad,
  OpenContextMenuCommand,
  LoadStartOptionsCommand, 
  InitializeWelcomePageCommand, 
  LoadSandboxedWorkspaceCommand,
} from "./commands";


const hostInfo = Url.parse(window.location.toString(), true);


const config: IEditorBrowserConfig = {
  isPeer: location.protocol === "http:",
  family: EditorFamilyType.BROWSER,
  log: {
    level: LogLevel.ALL
  },
  element: document.querySelector("#mount") as HTMLElement,
  server: {
    protocol: "http:",
    hostname: location.hostname || "localhost",
    port: Number(hostInfo.query.backendPort || hostInfo.port || 80)
  }
};

let i = 0;
const createSepName = () => `sep${i++}`;

function createMenuProviders() {
  return [

    new WebMenuItemFactoryProvider("app", (parent: WebMenuItem) => parent.type === "menubar", createWebMenuItemClass("Tandem")),
    new WebMenuItemFactoryProvider("appAbout", "app", createWebMenuItemClass(undefined, "about")),
    WebMenuItemFactoryProvider.createSeparatorProvider("app"),
    new WebMenuItemFactoryProvider("installShellCommands", "app", createKeyCommandMenuItemClass("Install Shell Commands", undefined, InstallCommandLineToolsRequest)),
    WebMenuItemFactoryProvider.createSeparatorProvider("app"),
    new WebMenuItemFactoryProvider("quit", "app", createWebMenuItemClass(undefined, "quit")),

    ...createWorkspaceMenuProviders(),
    ...createWelcomeMenuProviders(),

    new WebMenuItemFactoryProvider("help", (parent: WebMenuItem) => parent.type === "menubar", createWebMenuItemClass(undefined, "help")),
 ];
}


function createWorkspaceMenuProviders() {

  const debugMenuOptions = [

    // turn off for production
    new WebMenuItemFactoryProvider("debug", "view", createWebMenuItemClass("Debug")),
    new WebMenuItemFactoryProvider("debugReload", "debug", createWebMenuItemClass(undefined, "reload")),
    new WebMenuItemFactoryProvider("debugToggleDevTools", "debug", createWebMenuItemClass(undefined, "toggledevtools")),

  ];

  return [
    new WebMenuItemFactoryProvider("file", EditorRouteNames.WORKSPACE, createWebMenuItemClass("File")),
    new WebMenuItemFactoryProvider("open", "file", createKeyCommandMenuItemClass("Open", "CmdOrCtrl+o", OpenRequest)),
    new WebMenuItemFactoryProvider("saveAll", "file", createKeyCommandMenuItemClass("Save All", "Alt+CmdOrCtrl+s", SaveAllRequest)),

    new WebMenuItemFactoryProvider("edit", EditorRouteNames.WORKSPACE, createWebMenuItemClass("Edit")),
    new WebMenuItemFactoryProvider("delete", "edit", createKeyCommandMenuItemClass("Delete", "backspace", RemoveSelectionRequest)),
    new WebMenuItemFactoryProvider("deleteSep", "edit", createMenuSeparatorClass()),
    new WebMenuItemFactoryProvider("cut", "edit", createWebMenuItemClass(undefined, "cut")),
    new WebMenuItemFactoryProvider("copy", "edit", createWebMenuItemClass(undefined, "copy")),
    new WebMenuItemFactoryProvider("paste", "edit", createWebMenuItemClass(undefined, "paste")),
    new WebMenuItemFactoryProvider("selectAll", "edit", createWebMenuItemClass(undefined, "selectall")),

    new WebMenuItemFactoryProvider("view", EditorRouteNames.WORKSPACE, createWebMenuItemClass("View")),
    new WebMenuItemFactoryProvider("zoomIn", "view", createKeyCommandMenuItemClass("Zoom In", "CmdOrCtrl+plus", ZoomInRequest)),
    new WebMenuItemFactoryProvider("zoomOut", "view", createKeyCommandMenuItemClass("Zoom Out", "CmdOrCtrl+-", ZoomOutRequest)),
    new WebMenuItemFactoryProvider("zoomSep", "view", createMenuSeparatorClass()),

    ...(process.env.DEV || true ? debugMenuOptions : []),

    new WebMenuItemFactoryProvider("debugSep", "view", createMenuSeparatorClass()),
    new WebMenuItemFactoryProvider("toggleTools", "view", createKeyCommandMenuItemClass("Toggle Stage Tools", "Ctrl+CmdOrCtrl+T", ToggleStageToolsRequest)),
    new WebMenuItemFactoryProvider("toggleLeftGutter", "view", createKeyCommandMenuItemClass("Toggle Left Gutter", "Alt+\\", createToggleSettingRequestClass(SettingKeys.HIDE_LEFT_SIDEBAR))),
    new WebMenuItemFactoryProvider("toggleRightGutter", "view", createKeyCommandMenuItemClass("Toggle Right Gutter", "Alt+/", createToggleSettingRequestClass(SettingKeys.HIDE_RIGHT_SIDEBAR))),
  ]
}

function createWelcomeMenuProviders() {
  return [
  ];
}

const kernel = new Kernel(
  
  // Commands
  new CommandFactoryProvider(OpenRequest.OPEN, OpenCommand),
  new CommandFactoryProvider(OpenContextMenuRequest.OPEN_CONTEXT_MENU, OpenContextMenuCommand),
  new CommandFactoryProvider(ApplicationReadyMessage.READY, InitializeWelcomePageCommand),
  new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, LoadHelpOptionsCommad),
  new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, LoadStartOptionsCommand),
  new CommandFactoryProvider(DidRedirectMessage.DID_REDIRECT, SetMenuCommand),

  // createTextEditorProviders(),

  // for DEV
  new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, LoadSandboxedWorkspaceCommand, -Infinity),
  createHTMLEditorWorkerProviders(),
  createTDProjectEditorWorkerProviders(),
  createSyntheticHTMLProviders(),

  // menus
  ...createMenuProviders(),

  // Pages
  new PageFactoryProvider(StudioRouteNames.WELCOME, WelcomeComponent),
  new RouteFactoryProvider(StudioRouteNames.WELCOME, "/welcome", WelcomeRouteHandler),
  
  new TandemStudioBrowserStoreProvider(TandemStudioBrowserStore),
  createEditorBrowserProviders(config),
  createHTMLEditorBrowserProviders(),
  createTDProjectEditorBrowserProviders(),
  // createCollaborateExtensionBrowserProviders(),
);

const app = window["app"] = new ServiceApplication(kernel);

const _readyCallbacks = [];

// for synthetic DOM
window["syntheticDOMReadyCallback"] = () => {
  return new Promise((resolve) => {
    _readyCallbacks.push(resolve);
  });
}

app.initialize().then(() => {

  // give time for rAF
  setTimeout(() => {
    _readyCallbacks.forEach(resolve => resolve());
  }, 300);
});
