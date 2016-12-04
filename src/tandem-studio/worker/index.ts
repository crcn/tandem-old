import { argv } from "yargs";
import * as getPort from "get-port";
import { SockService, DSService } from "./services";
import "./messages";

import { ImportFileRequest } from "@tandem/editor/browser/messages";
import { PreviewLoaderProvider } from "@tandem/editor/worker/providers";
import { MarkupMimeTypeXMLNSProvider } from "@tandem/synthetic-browser";
import { MongoDataStore, MemoryDataStore } from "@tandem/mesh";
import { createJavaScriptWorkerProviders } from "@tandem/javascript-extension/editor/server";
import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/server";
import { createHTMLEditorWorkerProviders } from "@tandem/html-extension/editor/server";
import { createCoreMarkdownExtensionProviders } from "@tandem/markdown-extension";
import { isMaster, fork, addListener, emit } from "cluster";
import { createTDProjectEditorWorkerProviders } from "@tandem/tdproject-extension/editor/server";
import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/server";
import { EditorFamilyType, createCommonEditorProviders } from "@tandem/editor/common";
import { ServiceApplication, ApplicationServiceProvider } from "@tandem/core";
import { GetProjectStartOptionsRequest, LoadProjectConfigCommand, PingRequest } from "tandem-studio/common";
import { FileImporterProvider } from "@tandem/editor/worker";
import { IStudioWorkerConfig } from "./config";

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

import { DSProvider } from "./providers";
import { 
  ApplyFileEditCommand, 
  SyncFileCacheCommand, 
  ImportFileCommand, 
  StartMasterPingCommand, 
} from "./commands";

import {
  ApplyFileEditRequest,
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
    createCoreMarkdownExtensionProviders(),
    createTDProjectEditorWorkerProviders(),
    createTypescriptEditorWorkerProviders(),
    new CommandFactoryProvider(LoadApplicationRequest.LOAD, LoadProjectConfigCommand),
    new ProtocolURLResolverProvider("webpack", WebpackProtocolResolver),
    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
  ];
}

export const initializeWorker = async () => {

  const config: IStudioWorkerConfig = {
    family: EditorFamilyType.WORKER,
    cwd: process.cwd(),
    experimental: !!process.env.EXPERIMENTAL,
    port: process.env.PORT,
    hostname: process.env.HOSTNAME,
    log: {
      level: Number(process.env.LOG_LEVEL),
      prefix: "worker "
    }
  };

  const injector = new Injector(
    createCommonEditorProviders(config),
    createCoreStudioWorkerProviders(),
    new DSProvider(config.experimental ? new MongoDataStore("mongodb://localhost:27017/tandem") : new MemoryDataStore()),
    new ApplicationServiceProvider("sock", SockService),
    new ApplicationServiceProvider("ds", DSService),
    createSyntheticBrowserWorkerProviders(),
    
    // commands
    new CommandFactoryProvider(ImportFileRequest.IMPORT_FILE, ImportFileCommand),
    new CommandFactoryProvider(ApplyFileEditRequest.APPLY_EDITS, ApplyFileEditCommand),
    new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, SyncFileCacheCommand),
    new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, StartMasterPingCommand),
  );

  const app = new ServiceApplication(injector);

  // hook with the master process
  app.bus.register(hook(config.family, app.bus));

  await app.initialize();
}