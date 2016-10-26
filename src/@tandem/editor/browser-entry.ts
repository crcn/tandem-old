import "./entry-shims";

import { Dependencies } from "@tandem/common";
import { ServiceApplication } from "@tandem/core";
import { IEditorBrowserConfig, concatEditorBrowserDependencies } from "./browser";

// extensions
import { createSASSEditorWorkerDependencies } from "@tandem/sass-extension/editor/worker";
import { createTDProjectEditorBrowserDependencies } from "@tandem/tdproject-extension/editor/browser";
import { createHTMLEditorBrowserDependencies, createHTMLEditorWorkerDependencies } from "@tandem/html-extension/editor/browser";

const element = document.createElement("div");
document.body.appendChild(element);

const config: IEditorBrowserConfig = {
  element: element,
  server: window["config"].server
};

const deps = new Dependencies(
  createHTMLEditorWorkerDependencies(),
  createHTMLEditorBrowserDependencies(),
  createSASSEditorWorkerDependencies(),
  createTDProjectEditorBrowserDependencies()
);

const app = window["app"] = new ServiceApplication(
  concatEditorBrowserDependencies(deps, config)
);

window.onload = app.initialize.bind(app);
