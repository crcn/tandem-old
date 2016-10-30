import "./entry-shims";

import { Injector } from "@tandem/common";
import { ServiceApplication } from "@tandem/core";
import { IEditorBrowserConfig, concatEditorBrowserDependencies } from "./browser";

// extensions
import { createSASSEditorWorkerDependencies } from "@tandem/sass-extension/editor/worker";
import { createSyntheticBrowserWorkerDependencies } from "@tandem/synthetic-browser";
import { createTDProjectEditorBrowserDependencies } from "@tandem/tdproject-extension/editor/browser";
import { createHTMLEditorBrowserDependencies, createHTMLEditorWorkerDependencies } from "@tandem/html-extension/editor/browser";

const element = document.createElement("div");
document.body.appendChild(element);

const config: IEditorBrowserConfig = {
  element: element,
  server: window["config"].server
};

const deps = new Injector(

  // worker deps
  // createHTMLEditorWorkerDependencies(),
  // createSASSEditorWorkerDependencies(),
  // createSyntheticBrowserWorkerDependencies(),

  createHTMLEditorBrowserDependencies(),
  createTDProjectEditorBrowserDependencies(),
);

const app = window["app"] = new ServiceApplication(
  concatEditorBrowserDependencies(deps, config)
);

window.onload = app.initialize.bind(app);
