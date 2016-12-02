import "reflect-metadata";

import * as path from "path";

declare let __webpack_public_path__: any;

__webpack_public_path__ = `${location.protocol}//${path.dirname(location.pathname)}/`;


import * as Url from "url";
import { ServiceApplication } from "@tandem/core";
import { EditorFamilyType } from "@tandem/editor/common";
import { TandemStudioBrowserStore } from "./stores";
import { TandemStudioBrowserStoreProvider } from "./providers";
import { createHTMLEditorBrowserProviders } from "@tandem/html-extension/editor/browser";
import { createTDProjectEditorBrowserProviders } from "@tandem/tdproject-extension/editor/browser";
import { 
  Injector, 
  LogLevel, 
  LoadApplicationRequest, 
  CommandFactoryProvider, 
  ApplicationReadyMessage,
  InitializeApplicationRequest, 
} from "@tandem/common";

import { 
  RouteNames,
  PageFactoryProvider, 
  IEditorBrowserConfig, 
  RouteFactoryProvider,
  createStatedRouteClass,
  createCommonEditorProviders, 
  createEditorBrowserProviders, 
} from "@tandem/editor/browser";

import { StudioPageNames } from "./constants";
import { WelcomeComponent } from "./components";
import { InitializeWelcomePageCommand, LoadStartOptionsCommand } from "./commands";

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

const injector = new Injector(

  // Commands
  new CommandFactoryProvider(ApplicationReadyMessage.READY, InitializeWelcomePageCommand),
  new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, LoadStartOptionsCommand),

  // Pages
  new PageFactoryProvider(StudioPageNames.WELCOME, WelcomeComponent),
  new RouteFactoryProvider(StudioPageNames.WELCOME, "/welcome", createStatedRouteClass({[RouteNames.ROOT]: StudioPageNames.WELCOME })),

  
  new TandemStudioBrowserStoreProvider(TandemStudioBrowserStore),
  createEditorBrowserProviders(config),
  createHTMLEditorBrowserProviders(),
  createTDProjectEditorBrowserProviders(),
);

const app = window["app"] = new ServiceApplication(injector);

app.initialize();
