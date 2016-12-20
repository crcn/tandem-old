import { argv } from "yargs";
import getPort = require("get-port");
import { SockService } from "./services";
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
import { OpenProjectEnvironmentChannelCommand } from "@tandem/editor/master";
import { createCoreMarkdownExtensionProviders } from "@tandem/markdown-extension";
import { createTDProjectEditorWorkerProviders } from "@tandem/tdproject-extension/editor/server";
import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/server";
import { GetProjectStartOptionsRequest, LoadProjectConfigCommand, PingRequest } from "tandem-code/common";
import { EditorFamilyType, createCommonEditorProviders, OpenProjectEnvironmentChannelRequest } from "@tandem/editor/common";

import { 
  createSyntheticHTMLProviders,
  SyntheticDOMElementClassProvider, 
  ElementTextContentMimeTypeProvider,
  createSyntheticBrowserWorkerProviders, 
} from "@tandem/synthetic-browser";
import {
  hook,
  Kernel,
  LogLevel,
  serialize,
  DSService,
  DSProvider,
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
import { 
  SyncFileCacheCommand, 
  ImportFileCommand, 
  StartMasterPingCommand, 
} from "./commands";

import {
  ApplyFileEditCommand, 
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
    createSyntheticHTMLProviders(),
    createHTMLEditorWorkerProviders(),
    createSASSEditorWorkerProviders(),
    createCommonjsWorkerProviders(),
    createCoreMarkdownExtensionProviders(),
    createTDProjectEditorWorkerProviders(),
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
    server: {
      protocol: "http:",
      port: process.env.PORT,
      hostname: process.env.HOSTNAME,
    },
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
    new CommandFactoryProvider(OpenProjectEnvironmentChannelRequest.OPEN_PROJECT_ENVIRONMENT_CHANNEL, OpenProjectEnvironmentChannelCommand),
  );

  const app = new ServiceApplication(kernel);

  // hook with the master process
  app.bus.register(hook(config.family, app.bus));

  await app.initialize();
}