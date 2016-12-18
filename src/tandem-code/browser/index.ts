import "reflect-metadata";

import path =  require("path");

declare let __webpack_public_path__: any;

__webpack_public_path__ = `${location.protocol}//${path.dirname(location.pathname)}/`;


import Url =  require("url");
import { TandemStudioBrowserStore } from "./stores";
import { InstallCommandLineToolsRequest } from "tandem-code/common";
import { EditorFamilyType } from "@tandem/editor/common";

import { 
  SettingKeys,
  WebMenuItem, 
  SaveAllRequest,
  createWebMenuItemClass, 
  ToggleStageToolsRequest,
  createMenuSeparatorClass, 
  WebMenuItemFactoryProvider, 
  createKeyCommandMenuItemClass, 
  createToggleSettingRequestClass,
} from "@tandem/editor/browser";

import { createHTMLEditorBrowserProviders } from "@tandem/html-extension/editor/browser";
import { createHTMLEditorWorkerProviders } from "@tandem/html-extension/editor/worker";
import { createTDProjectEditorBrowserProviders } from "@tandem/tdproject-extension/editor/browser";
import { createTDProjectEditorWorkerProviders } from "@tandem/tdproject-extension/editor/worker";
import { TandemStudioBrowserStoreProvider } from "./providers";

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
  createCommonEditorProviders, 
  createEditorBrowserProviders, 
} from "@tandem/editor/browser";

import {StudioRouteNames } from "./constants";
import { WelcomeComponent } from "./components";
import { 
  OpenCommand,
  SetMenuCommand,
  LoadHelpOptionsCommad,
  LoadStartOptionsCommand, 
  LoadSandboxedWorkspaceCommand,
  InitializeWelcomePageCommand, 
} from "./commands";


const config: IEditorBrowserConfig = {
  family: EditorFamilyType.BROWSER,
  log: {
    level: LogLevel.ALL
  },
  element: document.querySelector("#mount") as HTMLElement,
  server: {
    protocol: "http:",
    hostname: "localhost",
    cwd: process.cwd(),
    port: Number(Url.parse(window.location.toString(), true).query.backendPort)
  }
};

let i = 0;
const createSepName = () => `sep${i++}`;

function createMenuProviders() {
  return [

    new WebMenuItemFactoryProvider("app", (parent: WebMenuItem) => parent.root === parent, createWebMenuItemClass("Tandem")),
    new WebMenuItemFactoryProvider("appAbout", "app", createWebMenuItemClass(undefined, "about")),
    WebMenuItemFactoryProvider.createSeparatorProvider("app"),
    new WebMenuItemFactoryProvider("installShellCommands", "app", createKeyCommandMenuItemClass("Install Shell Commands", undefined, InstallCommandLineToolsRequest)),
    WebMenuItemFactoryProvider.createSeparatorProvider("app"),
    new WebMenuItemFactoryProvider("quit", "app", createWebMenuItemClass(undefined, "quit")),

    ...createWorkspaceMenuProviders(),
    ...createWelcomeMenuProviders(),

    new WebMenuItemFactoryProvider("help", (parent: WebMenuItem) => parent.root === parent, createWebMenuItemClass(undefined, "help")),

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
    // new WebMenuItemFactoryProvider("undo", "edit", createKeyCommandMenuItemClass("Zoom In", "CmdOrCtrl+plus", ZoomInRequest)),
    // new WebMenuItemFactoryProvider("redo", "edit", createKeyCommandMenuItemClass("Zoom In", "CmdOrCtrl+plus", ZoomInRequest)),
    new WebMenuItemFactoryProvider("delete", "edit", createKeyCommandMenuItemClass("Delete", "backspace", RemoveSelectionRequest)),
    new WebMenuItemFactoryProvider("deleteSep", "edit", createMenuSeparatorClass()),
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
  new CommandFactoryProvider(ApplicationReadyMessage.READY, InitializeWelcomePageCommand),
  new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, LoadHelpOptionsCommad),
  new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, LoadStartOptionsCommand),
  new CommandFactoryProvider(DidRedirectMessage.DID_REDIRECT, SetMenuCommand),

  // for DEV
  new CommandFactoryProvider(ApplicationReadyMessage.READY, LoadSandboxedWorkspaceCommand),
  createHTMLEditorWorkerProviders(),
  createTDProjectEditorWorkerProviders(),

  // menus
  ...createMenuProviders(),

  // Pages
  new PageFactoryProvider(StudioRouteNames.WELCOME, WelcomeComponent),
  new RouteFactoryProvider(StudioRouteNames.WELCOME, "/welcome", WelcomeRouteHandler),
  
  new TandemStudioBrowserStoreProvider(TandemStudioBrowserStore),
  createEditorBrowserProviders(config),
  createHTMLEditorBrowserProviders(),
  createTDProjectEditorBrowserProviders(),


);

const app = window["app"] = new ServiceApplication(kernel);

app.initialize();
