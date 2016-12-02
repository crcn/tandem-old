import { argv } from "yargs";
import * as getPort from "get-port";
import { SockService } from "@tandem/editor/server";
import { EditorFamilyType } from "@tandem/editor/common";
import { PreviewLoaderProvider } from "@tandem/editor/worker/providers";
import { LoadProjectConfigCommand } from "@tandem/editor/worker/commands";
import { MarkupMimeTypeXMLNSProvider } from "@tandem/synthetic-browser";
import { MongoDataStore, MemoryDataStore } from "@tandem/mesh";
import { createJavaScriptWorkerProviders } from "@tandem/javascript-extension/editor/server";
import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/server";
import { createHTMLEditorWorkerProviders } from "@tandem/html-extension/editor/server";
import { isMaster, fork, addListener, emit } from "cluster";
import { createTDProjectEditorWorkerProviders } from "@tandem/tdproject-extension/editor/server";
import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/server";
import { ServiceApplication, ApplicationServiceProvider } from "@tandem/core";
import { GetProjectStartOptionsRequest, StartProjectRequest } from "tandem-studio/common";
import { IEdtorServerConfig, FileImporterProvider, createEditorServerProviders } from "@tandem/editor/server";
import { createSyntheticBrowserWorkerProviders, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";
import {
  hook,
  Injector,
  LogLevel,
  serialize,
  deserialize,
  MimeTypeProvider,
  PrivateBusProvider,
  MimeTypeAliasProvider,
  CommandFactoryProvider,
  LoadApplicationRequest,
  InitializeApplicationRequest,
} from "@tandem/common";

import { GetProjectStarterOptionsCommand, StartProjectCommand } from "./commands";
import { ProjectStarterFactoryProvider } from "./providers"; 
import { HTMLProjectStarter } from "./project"; 

import {
  createSandboxProviders,
  WebpackProtocolResolver,
  ProtocolURLResolverProvider,
  ContentEditorFactoryProvider,
  WebpackDependencyGraphStrategy,
  DependencyGraphStrategyProvider,
  DependencyLoaderFactoryProvider,
  SandboxModuleEvaluatorFactoryProvider,
} from "@tandem/sandbox";

export const createCoreStudioWorkerProviders = () => {
  return [
    createHTMLEditorWorkerProviders(),
    createSASSEditorWorkerProviders(),
    createJavaScriptWorkerProviders(),
    createTDProjectEditorWorkerProviders(),
    createTypescriptEditorWorkerProviders(),
    new CommandFactoryProvider(LoadApplicationRequest.LOAD, LoadProjectConfigCommand),
    new ProtocolURLResolverProvider("webpack", WebpackProtocolResolver),
    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
  ];
}

export const initializeWorker = async () => {

  const config: IEdtorServerConfig = {
    family: EditorFamilyType.MASTER,
    cwd: process.cwd(),
    experimental: !!process.env.EXPERIMENTAL,
    port: process.env.PORT,
    argv: argv,
    hostname: process.env.HOSTNAME,
    log: {
      level: Number(process.env.LOG_LEVEL),
      prefix: "worker "
    }
  };

  const injector = new Injector(
    createCoreStudioWorkerProviders(),
    createEditorServerProviders(config, config.experimental ? new MongoDataStore("mongodb://localhost:27017/tandem") : new MemoryDataStore()),
    createSyntheticBrowserWorkerProviders(),

    // commands
    new CommandFactoryProvider(GetProjectStartOptionsRequest.GET_PROJECT_STARTER_OPTIONS, GetProjectStarterOptionsCommand),
    new CommandFactoryProvider(StartProjectRequest.START_NEW_PROJECT, StartProjectCommand),
    
    // starters
    new ProjectStarterFactoryProvider({ 
      id: "html", 
      label: "HTML",
      image: "assets/html5-logo.png",
      enabled: true
    }, HTMLProjectStarter),

    new ProjectStarterFactoryProvider({ 
      id: "react+webpack", 
      label: "React + Webpack",
      image: "assets/react-logo.png",
      enabled: false
    }, function(){} as any),

    new ProjectStarterFactoryProvider({ 
      id: "angular2", 
      label: "Angular2",
      image: "assets/angular-logo.png",
      enabled: false
    }, function(){} as any),

    new ProjectStarterFactoryProvider({ 
      id: "ember", 
      label: "Ember",
      image: "assets/ember-logo.png",
      enabled: false
    }, function(){} as any),

    new ProjectStarterFactoryProvider({ 
      id: "jekyll", 
      label: "Jekyll",
      image: "assets/jekyll-logo.png",
      enabled: false
    }, function(){} as any)
  );

  const app = new ServiceApplication(injector);

  // hook with the master process
  app.bus.register(hook(config.family, app.bus));

  await app.initialize();
}