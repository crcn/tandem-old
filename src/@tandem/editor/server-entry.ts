import "./entry-shims";
import * as figlet from "figlet";

import { argv } from "yargs";
import { Injector, Logger, PrivateBusProvider } from "@tandem/common";
import { ServiceApplication } from "@tandem/core";
import { IEdtorServerConfig, concatEditorServerProviders } from "./server";

// extensions
// import { createVueWorkerProviders } from "@tandem/vue-extension/editor/server";
import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/server";
import { createJavaScriptWorkerProviders } from "@tandem/javascript-extension/editor/server";
import { createTDProjectEditorServerProviders } from "@tandem/tdproject-extension/editor/server";
import { createSyntheticBrowserWorkerProviders } from "@tandem/synthetic-browser";
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

let deps = new Injector(
  createHTMLEditorServerProviders(),

  // worker deps
  // createVueWorkerProviders(),
  createJavaScriptWorkerProviders(),
  createHTMLEditorWorkerProviders(),
  createSASSEditorWorkerProviders(),
  createSyntheticBrowserWorkerProviders(),
  createTDProjectEditorServerProviders()
);

deps = concatEditorServerProviders(deps, config);

const app = new ServiceApplication(deps);

console.log(figlet.textSync("Tandem", { font: "Slant" }), "\n");

app.initialize();

const logger = new Logger(PrivateBusProvider.getInstance(deps));

process.on("unhandledRejection", function(error) {
  logger.error(`Unhandled Rejection ${error.stack}`);
});

process.on("uncaughtException", function(error) {
  logger.error(`Uncaught Exception ${error.stack}`);
});