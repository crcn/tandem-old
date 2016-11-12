const { server, logLevel, cwd } = window["config"];

declare let __webpack_public_path__: any;

__webpack_public_path__ = `${location.protocol}//${server.hostname}:${server.port}${location.pathname}`;

import "./entry-shims";

import { Injector } from "@tandem/common";
import { ServiceApplication } from "@tandem/core";
import { IEditorBrowserConfig, concatEditorBrowserProviders } from "./browser";

// extensions
import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/worker";
import { createSyntheticBrowserWorkerProviders } from "@tandem/synthetic-browser";
import { createTDProjectEditorBrowserProviders } from "@tandem/tdproject-extension/editor/browser";
import { createHTMLEditorBrowserProviders, createHTMLEditorWorkerProviders } from "@tandem/html-extension/editor/browser";

const element = document.createElement("div");
document.body.appendChild(element);

const config: IEditorBrowserConfig = {
  element: element,
  server: server,
  logLevel: logLevel
};

const deps = new Injector(

  // worker deps
  // createHTMLEditorWorkerProviders(),
  // createSASSEditorWorkerProviders(),
  // createSyntheticBrowserWorkerProviders(),

  createHTMLEditorBrowserProviders(),
  createTDProjectEditorBrowserProviders(),
);

const app = window["app"] = new ServiceApplication(
  concatEditorBrowserProviders(deps, config)
);

window.onload = app.initialize.bind(app);
