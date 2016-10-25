import "./entry-shims";

import { Dependencies } from "@tandem/common";

import {
  EditorApplication,
  IEditorBrowserConfig,
  concatEditorBrowserDependencies,
} from "./browser";

// mountable element for the react app
const element = document.createElement("div");
document.body.appendChild(element);

const config: IEditorBrowserConfig = {
  element: element,
  server: {
    // TODO
  }
};


const deps = new Dependencies();

const app = window["app"] = new EditorApplication(
  concatEditorBrowserDependencies(deps, config)
);

window.onload = app.initialize.bind(app);
