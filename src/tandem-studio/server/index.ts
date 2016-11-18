import { argv } from "yargs";
import * as electron from "electron";
import * as getPort from "get-port";
import { EditorFamilyType } from "@tandem/editor/common";
import { FileCacheProvider } from "@tandem/sandbox";
import { ServiceApplication } from "@tandem/core";
import { createCoreStudioWorkerProviders } from "../worker";
import { MongoDataStore, MemoryDataStore } from "@tandem/mesh";
import { InitializeWindowCommand, SpawnWorkerCommand } from "./commands";
import { createEditorServerProviders, IEdtorServerConfig } from "@tandem/editor/server";
import {
   Injector,
   LogLevel,
   serialize,
   LoadRequest,
   IBrokerBus,
   deserialize,
   InitializeRequest,
   CommandFactoryProvider,
} from "@tandem/common";


process.env.LOG_LEVEL = process.env.LOG_LEVEL || LogLevel[String(argv.logLevel).toUpperCase()] || LogLevel.DEFAULT;

export const initializeMaster = async () => {

  const config: IEdtorServerConfig = {
    family: EditorFamilyType.MASTER,
    cwd: process.cwd(),
    experimental: !!argv.experimental,
    port: process.env.PORT || (process.env.PORT = await getPort()),
    argv: argv,
    hostname: process.env.HOSTNAME || (process.env.HOSTNAME = "localhost"),
    log: {
      level: Number(process.env.LOG_LEVEL),
      prefix: "master "
    }
  };

  const injector = new Injector(
    createCoreStudioWorkerProviders(),
    createEditorServerProviders(config, config.experimental ? new MongoDataStore("mongodb://localhost:27017/tandem") : new MemoryDataStore()),
    new CommandFactoryProvider(LoadRequest.LOAD, SpawnWorkerCommand),
    new CommandFactoryProvider(InitializeRequest.INITIALIZE, InitializeWindowCommand),
  );

  const app = new ServiceApplication(injector);
  await app.initialize();
}
