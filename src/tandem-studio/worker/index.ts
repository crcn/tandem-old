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
import { IEdtorServerConfig, FileImporterProvider, createEditorServerProviders } from "@tandem/editor/server";
import { createSyntheticBrowserWorkerProviders, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";
import {
  hook,
  Injector,
  LogLevel,
  serialize,
  LoadApplicationRequest,
  deserialize,
  MimeTypeProvider,
  InitializeApplicationRequest,
  PrivateBusProvider,
  MimeTypeAliasProvider,
  CommandFactoryProvider
} from "@tandem/common";

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
  );

  const app = new ServiceApplication(injector);

  // hook with the master process
  app.bus.register(hook(config.family, app.bus));

  await app.initialize();
}