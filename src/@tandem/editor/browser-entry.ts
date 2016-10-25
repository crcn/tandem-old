import "./entry-shims";

import { Dependencies } from "@tandem/common";

import {
  ServiceApplication,
  IEditorBrowserConfig,
  concatEditorBrowserDependencies,
} from "./browser";

// extensions - TODO
import { createHTMLEditorBrowserDependencies } from "@tandem/html-extension/editor/browser";
import { createTDProjectEditorBrowserDependencies } from "@tandem/tdproject-extension/editor/browser";

// mountable element for the react app
const element = document.createElement("div");
document.body.appendChild(element);

const config: IEditorBrowserConfig = {
  element: element,
  server: {
    // TODO
  }
};

const deps = new Dependencies(
  createHTMLEditorBrowserDependencies(),
  createTDProjectEditorBrowserDependencies()
);

const app = window["app"] = new ServiceApplication(
  concatEditorBrowserDependencies(deps, config)
);

window.onload = app.initialize.bind(app);
