import { argv } from "yargs";
import getPort = require("get-port");
import { SockService, DSService } from "./services";
import "./messages";

import { MemoryDataStore } from "@tandem/mesh";
import { ImportFileRequest } from "@tandem/editor/browser/messages";
import { IStudioWorkerConfig } from "./config";
import { FileImporterProvider } from "@tandem/editor/worker";
import { PreviewLoaderProvider } from "@tandem/editor/worker/providers";
import { MarkupMimeTypeXMLNSProvider } from "@tandem/synthetic-browser";
import { createCommonjsWorkerProviders } from "@tandem/commonjs-extension/editor/server";
import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/server";
import { createHTMLEditorWorkerProviders } from "@tandem/html-extension/editor/server";
import { isMaster, fork, addListener, emit } from "cluster";
import { createCoreMarkdownExtensionProviders } from "@tandem/markdown-extension";
import { createTDProjectEditorWorkerProviders } from "@tandem/tdproject-extension/editor/server";
import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/server";
import { EditorFamilyType, createCommonEditorProviders } from "@tandem/editor/common";
import { GetProjectStartOptionsRequest, LoadProjectConfigCommand, PingRequest } from "tandem-code/common";

import { createSyntheticBrowserWorkerProviders, SyntheticDOMElementClassProvider, ElementTextContentMimeTypeProvider } from "@tandem/synthetic-browser";
import {
  hook,
  Kernel,
  LogLevel,
  serialize,
  deserialize,
  MimeTypeProvider,
  ServiceApplication, 
  PrivateBusProvider,
  MimeTypeAliasProvider,
  CommandFactoryProvider,
  LoadApplicationRequest,
  ApplicationServiceProvider,
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
    createCommonjsWorkerProviders(),
    createCoreMarkdownExtensionProviders(),
    createTDProjectEditorWorkerProviders(),
    // createTypescriptEditorWorkerProviders(),
    new CommandFactoryProvider(LoadApplicationRequest.LOAD, LoadProjectConfigCommand),
    new ProtocolURLResolverProvider("webpack", WebpackProtocolResolver),
    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
  ];
}

export const initializeWorker = async () => {

  process.chdir(process.cwd());

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

  const kernel = new Kernel(
    createCommonEditorProviders(config),
    createCoreStudioWorkerProviders(),
    new DSProvider(new MemoryDataStore()),
    new ApplicationServiceProvider("sock", SockService),
    new ApplicationServiceProvider("ds", DSService),
    createSyntheticBrowserWorkerProviders(),
    
    // commands
    new CommandFactoryProvider(ImportFileRequest.IMPORT_FILE, ImportFileCommand),
    new CommandFactoryProvider(ApplyFileEditRequest.APPLY_EDITS, ApplyFileEditCommand),
    new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, SyncFileCacheCommand),
    new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, StartMasterPingCommand),
  );

  const app = new ServiceApplication(kernel);

  // hook with the master process
  app.bus.register(hook(config.family, app.bus));

  await app.initialize();
}