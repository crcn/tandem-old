import "reflect-metadata";

import * as path from "path";

declare let __webpack_public_path__: any;

__webpack_public_path__ = `${location.protocol}//${path.dirname(location.pathname)}/`;


import * as Url from "url";
import { Injector, LogLevel } from "@tandem/common";
import { ServiceApplication } from "@tandem/core";
import { EditorFamilyType } from "@tandem/editor/common";
import { createHTMLEditorBrowserProviders } from "@tandem/html-extension/editor/browser";
import { createTDProjectEditorBrowserProviders } from "@tandem/tdproject-extension/editor/browser";
import { createCommonEditorProviders, createEditorBrowserProviders, IEditorBrowserConfig } from "@tandem/editor/browser";

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
  createEditorBrowserProviders(config),
  createHTMLEditorBrowserProviders(),
  createTDProjectEditorBrowserProviders(),
);

const app = window["app"] = new ServiceApplication(injector);

app.initialize();
