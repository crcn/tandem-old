import "reflect-metadata";

import { merge } from "lodash";
import { HomeRouteHandler, ProjectRouteHandler } from "./routes";
import { IPlaygroundBrowserConfig } from "./config";
import { Kernel, ServiceApplication, ApplicationServiceProvider } from "@tandem/common";
import { createEditorBrowserProviders, EditorFamilyType, RouteFactoryProvider, GlobalKeyBindingService } from "@tandem/editor/browser";
import { createTDProjectEditorBrowserProviders } from "@tandem/tdproject-extension/editor/browser";
import { createHTMLEditorBrowserProviders } from "@tandem/html-extension/editor/browser";

const start = async () => {

  const config: IPlaygroundBrowserConfig = {
    element: document.getElementById("application"),
    family: EditorFamilyType.BROWSER,
    server: {
      port: process.env.API_PORT || Number(location.port) || 80,
      hostname: process.env.API_HOSTNAME || location.hostname,
      protocol: process.env.API_PROTOCOL || (location.protocol === "https:" ? "https:" : "http:")
    }
  };

  const kernel = new Kernel(
    createHTMLEditorBrowserProviders(),
    createEditorBrowserProviders(config),
    createTDProjectEditorBrowserProviders(),
    new RouteFactoryProvider("home", "/", HomeRouteHandler),
    new RouteFactoryProvider("home", "/workspace/:id", ProjectRouteHandler),
    new ApplicationServiceProvider("key-bindings", GlobalKeyBindingService)
  );

  const app = global["app"] = new ServiceApplication(kernel);
  
  await app.initialize();
}

start();
export * from "../common";