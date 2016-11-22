import { argv } from "yargs";
import * as electron from "electron";
import * as getPort from "get-port";
import { createCommonEditorProviders, IEditorCommonConfig } from "@tandem/editor/common";
import { FileCacheProvider } from "@tandem/sandbox";
import { ServiceApplication } from "@tandem/core";
import { createCoreStudioWorkerProviders } from "../worker";
import { SpawnWorkerCommand, InitializeWindowCommand } from "./commands";
import { createEditorServerProviders, IEdtorServerConfig } from "@tandem/editor/server";
import { createSyntheticBrowserWorkerProviders, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";
import {
   Injector,
   LogLevel,
   serialize,
   IBrokerBus,
   LoadRequest,
   deserialize,
   InitializeRequest,
   CommandFactoryProvider,
} from "@tandem/common";

process.env.LOG_LEVEL = process.env.LOG_LEVEL || LogLevel[String(argv.logLevel).toUpperCase()] || LogLevel.DEFAULT;

export const initializeMaster = async () => {

  const config: IEdtorServerConfig = {
    family: "none",
    cwd: process.cwd(),
    argv: argv,
    log: {
      level: Number(process.env.LOG_LEVEL)
    },
    experimental: argv.experimental ? (process.env.EXPERIMENTAL = true) : null,
    port: process.env.PORT || (process.env.PORT = await getPort()),
    hostname: process.env.HOSTNAME || (process.env.HOSTNAME = "localhost")
  };

  const injector = new Injector(
    createCommonEditorProviders(config),
    new CommandFactoryProvider(LoadRequest.LOAD, SpawnWorkerCommand),
    new CommandFactoryProvider(InitializeRequest.INITIALIZE, InitializeWindowCommand),
  );

  const app = new ServiceApplication(injector);
  await app.initialize();
}
