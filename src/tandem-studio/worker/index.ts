import { argv } from "yargs";
import * as getPort from "get-port";
import { SockService } from "@tandem/editor/server";
import { createJavaScriptWorkerProviders } from "@tandem/javascript-extension/editor/worker";
import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/worker";
import { createHTMLEditorWorkerProviders } from "@tandem/html-extension/editor/worker";
import { isMaster, fork, addListener, emit } from "cluster";
import { createTDProjectEditorWorkerProviders } from "@tandem/tdproject-extension/editor/worker";
import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/worker";
import { ServiceApplication, ApplicationServiceProvider } from "@tandem/core";
import { createEditorWorkerProviders, IEditorWorkerConfig } from "@tandem/editor/worker";
import { Injector, LogLevel, serialize, deserialize, PrivateBusProvider, hook, MimeTypeProvider, MimeTypeAliasProvider } from "@tandem/common";
import { createSyntheticBrowserWorkerProviders, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";
import { MarkupMimeTypeXMLNSProvider } from "@tandem/synthetic-browser";

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
    new ProtocolURLResolverProvider("webpack", WebpackProtocolResolver),
    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
  ];
}

export const initializeWorker = async () => {

  const config: IEditorWorkerConfig = {
    log: {
      level: Number(process.env.LOG_LEVEL),
      prefix: "worker "
    }
  };

  const injector = new Injector(
    createCoreStudioWorkerProviders(),
    createEditorWorkerProviders(config),
    createSyntheticBrowserWorkerProviders(),
  );

  const app = new ServiceApplication(injector);

  // hook with the master process
  app.bus.register(hook(app.bus));

  await app.initialize();
}