import "reflect-metadata";
import express = require("express");
import path = require("path");
import { argv } from "yargs";

import { MemoryDataStore } from "@tandem/mesh/ds";
import { MongoDataStore } from "@tandem/mesh/ds/mongo";
import { IPlaygroundServerConfig } from "./config";
import { createSyntheticHTMLProviders } from "@tandem/synthetic-browser";
import { createEditorMasterProviders } from "@tandem/editor/master";
import { createTDProjectCoreProviders } from "@tandem/tdproject-extension";
import { createHTMLEditorWorkerProviders } from "@tandem/html-extension/editor/worker";
import { createSyntheticBrowserWorkerProviders } from "@tandem/editor/worker";
import { createCommonEditorProviders, EditorFamilyType } from "@tandem/editor/common";
// import { CreateNewProjectCommand GetProjectCommand } from "./commands";
import { 
  createSandboxProviders, 
  URIProtocolProvider, 
  ApplyFileEditRequest, 
  ApplyFileEditCommand,
  FileCacheProvider,
  createRemoteProtocolProviders
} from "@tandem/sandbox";

import { 
  hook,
  Kernel, 
  LogLevel,
  DSService,
  DSProvider,
  ServiceApplication, 
  LoadApplicationRequest,
  CommandFactoryProvider,
  ApplicationServiceProvider,
  ApplicationConfigurationProvider, 
} from "@tandem/common";


// import { HTTPServerProvider } from "./providers";
import { BrowserService, WorkersService } from "./services";

process.env.LOG_LEVEL = process.env.LOG_LEVEL || (argv.logLevel ? LogLevel[argv.logLevel] : argv.verbose ? LogLevel.VERBOSE : undefined) || LogLevel.DEFAULT;

const start = async () => {

  const config: IPlaygroundServerConfig = {
    family: process.env.WORKER ? EditorFamilyType.WORKER : EditorFamilyType.MASTER,
    log: {
      level: Number(process.env.LOG_LEVEL)
    },
    server: {
      port: Number(process.env.PORT || 8090),
      hostname: process.env.HOSTNAME || "localhost",
      protocol: "http:"
    },
    worker: {
      mainPath: __dirname + "/index.js",
      env: {
        WORKER: true
      }
    },
    browserDirectory: path.join(__dirname, "..", "browser"),
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017"
  };

  const httpServer = express();

  const kernel = new Kernel(
    createSandboxProviders(),
    createSyntheticHTMLProviders(),
    createTDProjectCoreProviders(),
    createHTMLEditorWorkerProviders(),
    createSyntheticBrowserWorkerProviders(),
    new DSProvider(process.env.WORKER ? new MemoryDataStore() : new MongoDataStore(config.mongoUrl)),
    new ApplicationServiceProvider("ds", DSService),
  )

  if (process.env.WORKER) {
    kernel.register(
      createRemoteProtocolProviders(),
      new CommandFactoryProvider(ApplyFileEditRequest.APPLY_EDITS, ApplyFileEditCommand),
      createCommonEditorProviders(config)
    );

    // FileCacheProvider.getInstance(kernel).syncWithLocalFiles();

  } else {
    kernel.register(
      createEditorMasterProviders(config),
      new ApplicationServiceProvider("browser", BrowserService),
    );
  }
  
  const app = new ServiceApplication(kernel);
  
  // hook with the master process
  app.bus.register(hook(config.family, app.bus));

  await app.initialize();
  
}

start();

export * from "../common";