import "./entry-shims";

import { argv } from "yargs";
import { Dependencies } from "@tandem/common";
import { ServiceApplication } from "@tandem/core";
import { IEdtorServerConfig, concatEditorServerDependencies } from "./server";

// extensions
// import { createVueWorkerDependencies } from "@tandem/vue-extension/editor/server";
import { createSASSEditorWorkerDependencies } from "@tandem/sass-extension/editor/server";
import { createJavaScriptWorkerDependencies } from "@tandem/javascript-extension/editor/server";
import { createSyntheticBrowserWorkerDependencies } from "@tandem/synthetic-browser";
import { createTDProjectEditorServerDependencies } from "@tandem/tdproject-extension/editor/server";
import {
  createHTMLEditorServerDependencies,
  createHTMLEditorWorkerDependencies,
} from "@tandem/html-extension/editor/server";

const config: IEdtorServerConfig = {
  argv: argv,
  cwd: process.cwd(),
  entries: {
    editor: require.resolve(require('./package.json').browser)
  }
};

const deps = new Dependencies(
  createHTMLEditorServerDependencies(),

  // worker deps
  // createVueWorkerDependencies(),
  createJavaScriptWorkerDependencies(),
  createHTMLEditorWorkerDependencies(),
  createSASSEditorWorkerDependencies(),
  createSyntheticBrowserWorkerDependencies(),
  createTDProjectEditorServerDependencies()
);

const app = new ServiceApplication(
  concatEditorServerDependencies(deps, config)
);

app.initialize();

process.on("unhandledRejection", function(error) {
  console.log("unhandled rejection", error);
});

process.on("uncaughtException", function(error) {
  console.log("unhandled rejection", error);
});