import "./entry-shims";

import { argv } from "yargs";
import { Injector } from "@tandem/common";
import { ServiceApplication } from "@tandem/core";
import { IEdtorServerConfig, concatEditorServerProviders } from "./server";

// extensions
// import { createVueWorkerProviders } from "@tandem/vue-extension/editor/server";
import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/server";
import { createJavaScriptWorkerProviders } from "@tandem/javascript-extension/editor/server";
import { createSyntheticBrowserWorkerProviders } from "@tandem/synthetic-browser";
import { createTDProjectEditorServerProviders } from "@tandem/tdproject-extension/editor/server";
import {
  createHTMLEditorServerProviders,
  createHTMLEditorWorkerProviders,
} from "@tandem/html-extension/editor/server";

const config: IEdtorServerConfig = {
  argv: argv,
  cwd: process.cwd(),
  entries: {
    editor: require.resolve(require('./package.json').browser)
  }
};

const deps = new Injector(
  createHTMLEditorServerProviders(),

  // worker deps
  // createVueWorkerProviders(),
  createJavaScriptWorkerProviders(),
  createHTMLEditorWorkerProviders(),
  createSASSEditorWorkerProviders(),
  createSyntheticBrowserWorkerProviders(),
  createTDProjectEditorServerProviders()
);

const app = new ServiceApplication(
  concatEditorServerProviders(deps, config)
);

app.initialize();

process.on("unhandledRejection", function(error) {
  console.log("unhandled rejection", error);
});

process.on("uncaughtException", function(error) {
  console.log("unhandled rejection", error);
});