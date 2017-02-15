import "reflect-metadata";
import { 
  Kernel, 
  ServiceApplication, 
  ApplicationConfigurationProvider 
} from "@tandem/common";

import { EditorFamilyType } from "@tandem/editor";

import { 
  IEditorBrowserConfig,
  createEditorBrowserProviders,
} from "@tandem/editor/browser";

const initialize = async () => {

  const config: IEditorBrowserConfig = {
    isPeer: false,
    element: document.getElementById("application"),
    family: EditorFamilyType.BROWSER,
     server: {
      port: process.env.API_PORT || Number(location.port) || 80,
      hostname: process.env.API_HOSTNAME || location.hostname,
      protocol: process.env.API_PROTOCOL || (location.protocol === "https:" ? "https:" : "http:")
    }
  };

  const kernel = new Kernel(
    createEditorBrowserProviders(config)
  );
  
  const app = new ServiceApplication(kernel);
  await app.initialize();
};

window.onload = initialize;

// import { merge } from "lodash";
// import { TextEditorComponent } from "./components";
// import { IPlaygroundBrowserConfig } from "./config";
// import { createHTMLEditorBrowserProviders } from "@tandem/html-extension/editor/browser";
// import { HomeRouteHandler, ProjectRouteHandler } from "./routes";
// import { createTDProjectEditorBrowserProviders } from "@tandem/tdproject-extension/editor/browser";
// import { Kernel, ServiceApplication, ApplicationServiceProvider, CommandFactoryProvider, LoadApplicationRequest } from "@tandem/common";
// import { PlaygroundBrowserStoreProvider } from "./providers";
// import { RootPlaygroundBrowserStore } from "./stores";
// import { OpenFileCommand, UpdateFileCommand, WatchFilesCommand, UpdateTextEditorContentCommand } from "./commands";
// import { URIProtocolProvider } from "@tandem/sandbox";
// import { UpdateFileCacheRequest, FileCacheItemUpdatedMessage } from "./messages";
// import { 
//   OpenFileRequest,
//   EditorFamilyType, 
//   RouteFactoryProvider, 
//   GlobalKeyBindingService,
//   createEditorBrowserProviders, 
//   EditorComponentFactoryProvider,
// } from "@tandem/editor/browser";

// const start = async () => {

//   const config: IPlaygroundBrowserConfig = {
//     element: document.getElementById("application"),
//     family: EditorFamilyType.BROWSER,
//     server: {
//       port: process.env.API_PORT || Number(location.port) || 80,
//       hostname: process.env.API_HOSTNAME || location.hostname,
//       protocol: process.env.API_PROTOCOL || (location.protocol === "https:" ? "https:" : "http:")
//     }
//   };

//   const kernel = new Kernel(
//     createHTMLEditorBrowserProviders(),
//     createEditorBrowserProviders(config),
//     createTDProjectEditorBrowserProviders(),
//     new RouteFactoryProvider("home", "/", HomeRouteHandler),
//     new PlaygroundBrowserStoreProvider(RootPlaygroundBrowserStore),
//     new RouteFactoryProvider("home", "/workspace/:id", ProjectRouteHandler),
//     new ApplicationServiceProvider("key-bindings", GlobalKeyBindingService),
//     new EditorComponentFactoryProvider("textEditor", TextEditorComponent as any),
//     new CommandFactoryProvider(OpenFileRequest.OPEN_FILE, OpenFileCommand),
//     new CommandFactoryProvider(UpdateFileCacheRequest.UPDATE_FILE_CACHE, UpdateFileCommand),
//     new CommandFactoryProvider(LoadApplicationRequest.LOAD, WatchFilesCommand),
//     new CommandFactoryProvider(FileCacheItemUpdatedMessage.FILE_CACHE_ITEM_UPDATED, UpdateTextEditorContentCommand),
//   );

//   const app = global["app"] = new ServiceApplication(kernel);
  
//   await app.initialize();
// }

// start();
// export * from "../common";