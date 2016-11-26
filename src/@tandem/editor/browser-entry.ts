const { server, log, cwd } = window["config"];

declare let __webpack_public_path__: any;

__webpack_public_path__ = `${location.protocol}//${server.hostname}:${server.port}${location.pathname}`;

import "./entry-shims";

import { Injector } from "@tandem/common";
import { ServiceApplication } from "@tandem/core";
import { IEditorBrowserConfig, createEditorBrowserProviders, EditorFamilyType } from "./browser";

// extensions
import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/worker";
import { createSyntheticBrowserWorkerProviders } from "@tandem/synthetic-browser";
import { createTDProjectEditorBrowserProviders } from "@tandem/tdproject-extension/editor/browser";
import { createHTMLEditorBrowserProviders, createHTMLEditorWorkerProviders } from "@tandem/html-extension/editor/browser";

const element = document.createElement("div");
document.body.appendChild(element);

const config: IEditorBrowserConfig = {
  family: EditorFamilyType.BROWSER,
  element: element,
  server: server,
  log: log
};

const injector = new Injector(
  createHTMLEditorBrowserProviders(),
  createTDProjectEditorBrowserProviders(),
  createEditorBrowserProviders(config),
);

const app = window["app"] = new ServiceApplication(injector);

window.onload = app.initialize.bind(app);
