import { argv } from "yargs";
import * as electron from "electron";
import * as getPort from "get-port";
import * as MemoryDS from "mesh-memory-ds-bus";
import * as RemoteBus from "mesh-remote-bus";
import { isMaster, fork } from "cluster";
import { Injector, LogLevel, IBrokerBus, PrivateBusProvider, serialize, deserialize, CommandFactoryProvider, InitializeAction } from "@tandem/common";
import { ServiceApplication } from "@tandem/core";
import { InitializeWindowCommand } from "./commands";
import { createJavaScriptWorkerProviders } from "@tandem/javascript-extension/editor/server";
import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/server";
import { createTDProjectEditorServerProviders } from "@tandem/tdproject-extension/editor/server";
import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/server";
import { createSyntheticBrowserWorkerProviders } from "@tandem/synthetic-browser";
import { createEditorServerProviders, IEdtorServerConfig, MongoDS } from "@tandem/editor/server";
import { createHTMLEditorWorkerProviders, createHTMLEditorServerProviders } from "@tandem/html-extension/editor/server";

export const initializeMaster = async () => {

  const config: IEdtorServerConfig = {
    cwd: process.cwd(),
    experimental: !!argv.experimental,
    port: await getPort(),
    argv: argv,
    hostname: "localhost",
    log: {
      level: LogLevel.ALL,
      prefix: "master "
    }
  };

  const injector = new Injector(
    createHTMLEditorServerProviders(),
    createEditorServerProviders(config, config.experimental ? new MongoDS("mongodb://localhost:27017/tandem") : new MemoryDS()),
    createTDProjectEditorServerProviders(),

    new CommandFactoryProvider(InitializeAction.INITIALIZE, InitializeWindowCommand)
  );

  const app = new ServiceApplication(injector);
  await app.initialize();
  spawnWorker();
}

const spawnWorker = () => {
  const worker = fork();
  worker.addListener("disconnect", spawnWorker);
}
