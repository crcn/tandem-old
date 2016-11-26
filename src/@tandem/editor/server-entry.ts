import "./entry-shims";
import * as figlet from "figlet";

import { argv } from "yargs";
import * as getPort from "get-port";
import { ServiceApplication } from "@tandem/core";
import { MemoryDataStore, MongoDataStore } from "@tandem/mesh";
import { Injector, Logger, PrivateBusProvider, LogLevel, CommandFactoryProvider, LoadRequest } from "@tandem/common";
import { IEdtorServerConfig, createEditorServerProviders, EditorFamilyType } from "./server";
import { WebpackDependencyGraphStrategy, DependencyGraphStrategyProvider, ProtocolURLResolverProvider, WebpackProtocolResolver } from "@tandem/sandbox";

import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/server";
import { createJavaScriptWorkerProviders } from "@tandem/javascript-extension/editor/server";
import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/server";
import { createTDProjectEditorServerProviders } from "@tandem/tdproject-extension/editor/server";
import { LoadProjectConfigCommand } from "@tandem/editor/worker/commands";
import { createSyntheticBrowserWorkerProviders } from "@tandem/synthetic-browser";
import {
  createHTMLEditorServerProviders,
  createHTMLEditorWorkerProviders,
} from "@tandem/html-extension/editor/server";

const start = async () => {

  const config: IEdtorServerConfig = {
    family: EditorFamilyType.MASTER,
    argv: argv,
    port: argv.port || await getPort(),
    hostname: "localhost",
    experimental: !!argv.experimental,
    log: {
      level: LogLevel[String(argv.logLevel || "").toUpperCase()] || LogLevel.DEFAULT,
    },
    cwd: process.cwd(),
    entries: {
      editor: require.resolve(require('./package.json').browser)
    }
  };

  let injector = new Injector(
    createHTMLEditorServerProviders(),
    createJavaScriptWorkerProviders(),
    createHTMLEditorWorkerProviders(),
    createSASSEditorWorkerProviders(),
    createTypescriptEditorWorkerProviders(),
    createSyntheticBrowserWorkerProviders(),
    createTDProjectEditorServerProviders(),
    new CommandFactoryProvider(LoadRequest.LOAD, LoadProjectConfigCommand),
    new ProtocolURLResolverProvider("webpack", WebpackProtocolResolver),
    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
    createEditorServerProviders(config, config.experimental ? new MongoDataStore("mongodb://localhost:27017/tandem") : new MemoryDataStore())
  );

  const app = new ServiceApplication(injector);

  if (argv.banner !== false) {
    console.log(figlet.textSync("Tandem", { font: "Slant" }), "\n");
  }

  app.initialize();

  const logger = new Logger(PrivateBusProvider.getInstance(injector));

  process.on("unhandledRejection", function(error) {
    logger.error(`Unhandled Rejection ${error.stack}`);
  });

  process.on("uncaughtException", function(error) {
    logger.error(`Uncaught Exception ${error.stack}`);
  });
}

start();

