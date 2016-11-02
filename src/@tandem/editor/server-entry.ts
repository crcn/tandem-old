import "./entry-shims";
import * as figlet from "figlet";

import { argv } from "yargs";
import { ServiceApplication } from "@tandem/core";
import { Injector, Logger, PrivateBusProvider, LogLevel } from "@tandem/common";
import { IEdtorServerConfig, createEditorServiceProviders, MongoDS } from "./server";
import * as MemoryDS from "mesh-memory-ds-bus";

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
  logLevel: LogLevel[String(argv.logLevel || "").toUpperCase()] || LogLevel.DEFAULT,
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
  createTDProjectEditorServerProviders(),
  createEditorServiceProviders(config, new MongoDS("mongodb://localhost:27017/tandem"))
  // createEditorServiceProviders(config, new MemoryDS())
);

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