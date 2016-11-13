import "reflect-metadata";

import * as Url from "url";
import { Injector, LogLevel } from "@tandem/common";
import { ServiceApplication } from "@tandem/core";
import { createHTMLEditorBrowserProviders } from "@tandem/html-extension/editor/browser";
import { createTDProjectEditorBrowserProviders } from "@tandem/tdproject-extension/editor/browser";
import { createCommonEditorProviders, createEditorBrowserProviders, IEditorBrowserConfig } from "@tandem/editor/browser";

const config: IEditorBrowserConfig = {
  logLevel: LogLevel.ALL,
  element: document.querySelector("#app"),
  server: {
    protocol: "http:",
    hostname: "localhost",
    cwd: process.cwd(),
    port: Number(Url.parse(window.location.toString(), true).query.backendPort)
  }
} as any;

const injector = new Injector(
  createEditorBrowserProviders(config),
  createHTMLEditorBrowserProviders(),
  createTDProjectEditorBrowserProviders(),
);

const app = new ServiceApplication(injector);

app.initialize();
