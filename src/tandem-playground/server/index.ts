import "reflect-metadata";
import express = require("express");
import path = require("path");

import { MemoryDataStore } from "@tandem/mesh/ds";
import { MongoDataStore } from "@tandem/mesh/ds/mongo";
import { IPlaygroundServerConfig } from "./config";
import { createSyntheticHTMLProviders } from "@tandem/synthetic-browser";
import { createTDProjectCoreProviders } from "@tandem/tdproject-extension";
import { createHTMLEditorWorkerProviders } from "@tandem/html-extension/editor/worker";
import { createSyntheticBrowserWorkerProviders } from "@tandem/editor/worker";
import { createCommonEditorProviders, EditorFamilyType } from "@tandem/editor/common";
import { CreateNewProjectCommand, GetWorkerHostCommand, GetProjectCommand } from "./commands";
import { createSandboxProviders, URIProtocolProvider, ApplyFileEditRequest, ApplyFileEditCommand } from "@tandem/sandbox";

import { 
  Kernel, 
  DSService,
  DSProvider,
  ServiceApplication, 
  LoadApplicationRequest,
  CommandFactoryProvider,
  ApplicationServiceProvider,
  ApplicationConfigurationProvider, 
} from "@tandem/common";


// import { ProjectProtocol } from "./protocols";
import { GetWorkerHostRequest } from "./messages";
import { CreateNewProjectRequest, GetProjectRequest } from "tandem-playground/common";

import { HTTPServerProvider } from "./providers";
import { BrowserService, ProjectsService } from "./services";

const start = async () => {

  const config: IPlaygroundServerConfig = {
    family: process.env.WORKER ? EditorFamilyType.WORKER : EditorFamilyType.MASTER,
    port: Number(process.env.PORT || 8090),
    hostname: process.env.HOSTNAME || "localhost",
    browserDirectory: path.join(__dirname, "..", "browser"),
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017"
  };

  const httpServer = express();

  const kernel = new Kernel(
    createSyntheticHTMLProviders(),
     createTDProjectCoreProviders(),
    createHTMLEditorWorkerProviders(),
    createCommonEditorProviders(config),
    createSyntheticBrowserWorkerProviders(),
    new HTTPServerProvider(httpServer, httpServer.listen(config.port)),
    new DSProvider(process.env.WORKER ? new MemoryDataStore() : new MongoDataStore(config.mongoUrl)),
    // new URIProtocolProvider("project", ProjectProtocol),
    
    // services
    new ApplicationServiceProvider("browser", BrowserService),
    new ApplicationServiceProvider("projects", ProjectsService),
    new ApplicationServiceProvider("ds", DSService),
    
    // commands
    new CommandFactoryProvider(CreateNewProjectRequest.CREATE_NEW_PROJECT, CreateNewProjectCommand),
    new CommandFactoryProvider(GetWorkerHostRequest.GET_WORKER_HOST, GetWorkerHostCommand),
    new CommandFactoryProvider(GetProjectRequest.GET_PROJECT, GetProjectCommand),
    new CommandFactoryProvider(ApplyFileEditRequest.APPLY_EDITS, ApplyFileEditCommand)
  );
  
  const app = new ServiceApplication(kernel);

  await app.initialize();
}

start();