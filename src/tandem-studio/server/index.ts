import { argv } from "yargs";
import * as electron from "electron";
import * as getPort from "get-port";
import { FileCacheProvider } from "@tandem/sandbox";
import { ServiceApplication } from "@tandem/core";
import { EditorFamilyType } from "@tandem/editor/common";
import { createCoreStudioWorkerProviders } from "../worker";
import { createEditorServerProviders, IEdtorServerConfig } from "@tandem/editor/server";
import { createCommonEditorProviders, IEditorCommonConfig } from "@tandem/editor/common";
import { createSyntheticBrowserWorkerProviders, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";

import { IStudioEditorServerConfig } from "./config";
import { 
  SpawnWorkerCommand, 
  OpenNewWorkspaceCommand,
  CLIOpenWorkspaceCommand
} from "./commands";


import { 
  OpenNewWorkspaceRequest,
  GetProjectStartOptionsRequest,
} from "tandem-studio/common";

import {
   Injector,
   LogLevel,
   serialize,
   IBrokerBus,
   deserialize,
   CommandFactoryProvider,
   LoadApplicationRequest,
   ApplicationReadyMessage,
   InitializeApplicationRequest,
} from "@tandem/common";

process.env.LOG_LEVEL = process.env.LOG_LEVEL || LogLevel[String(argv.logLevel).toUpperCase()] || LogLevel.DEFAULT;

const BROWSER_BASE_PATH  = `${__dirname}/../browser`;

export const initializeMaster = async () => {

  const config: IStudioEditorServerConfig = {
    family: "none",
    browser: {
      assetUrl: `file://${BROWSER_BASE_PATH}/path`,
      indexUrl: `file://${BROWSER_BASE_PATH}/index.html`
    },
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
    new CommandFactoryProvider(LoadApplicationRequest.LOAD, SpawnWorkerCommand),
    new CommandFactoryProvider(OpenNewWorkspaceRequest.OPEN_NEW_WORKSPACE, OpenNewWorkspaceCommand),
    new CommandFactoryProvider(ApplicationReadyMessage.READY, CLIOpenWorkspaceCommand)
  );

  const app = new ServiceApplication(injector);
  await app.initialize();
}
