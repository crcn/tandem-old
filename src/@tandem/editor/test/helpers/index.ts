// import "reflect-metadata";
// TODO - giant mess of a setup here. This is okay for now as
// the internal API matures along with extensions. However, it *may* be good
// to modularize this piece of code later so that it's not so specific to certain libraries
// such as typescript, and sass.

import * as path from "path";
import { MarkupEditor } from "@tandem/synthetic-browser";
import { createSASSSandboxProviders } from "@tandem/sass-extension";
import { createCommonEditorProviders, ConsoleLogService, ReceiverService } from "@tandem/editor/common";
import { createJavaScriptSandboxProviders } from "@tandem/javascript-extension";
import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/worker";
import { createHTMLCoreProviders, createHTMLSandboxProviders } from "@tandem/html-extension";
import { createTestSandboxProviders, ISandboxTestProviderOptions } from "@tandem/sandbox/test/helpers";
import { ServiceApplication, ApplicationConfigurationProvider, ApplicationServiceProvider } from "@tandem/core";
import { Injector, InjectorProvider, PrivateBusProvider, BrokerBus, Application, HTML_MIME_TYPE, LogLevel, LogAction } from "@tandem/common";
import { WebpackDependencyGraphStrategy, DependencyGraphStrategyProvider, ProtocolURLResolverProvider, WebpackProtocolResolver, FileCacheProvider, ContentEditorFactoryProvider } from "@tandem/sandbox";

/**
 * creates a test master application that includes everything from the front-end
 * back-end, and workers.
 */

export interface IMasterTestAppicationOptions {
  log?: {
    level: LogLevel
  };
  typescript?: boolean;
  sandboxOptions?: ISandboxTestProviderOptions;
  createTestProviders?: () => any;
}

export const createTestMasterApplication = (options: IMasterTestAppicationOptions = {}) => {
  const bus = new BrokerBus();

  const injector = new Injector(
    new InjectorProvider(),
    createHTMLCoreProviders(),
    new PrivateBusProvider(bus),
    createSASSSandboxProviders(),
    createHTMLSandboxProviders(),
    new ApplicationServiceProvider("console", ConsoleLogService),
    new ApplicationServiceProvider("receiver", ReceiverService),
    createJavaScriptSandboxProviders(),
    options.typescript !== false ? createTypescriptEditorWorkerProviders() : [],
    new ApplicationConfigurationProvider(options),
    createTestSandboxProviders(options.sandboxOptions),
    new ContentEditorFactoryProvider(HTML_MIME_TYPE, MarkupEditor),
    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
    new ProtocolURLResolverProvider("webpack", WebpackProtocolResolver),
  );

  if (options.createTestProviders) {
    injector.register(options.createTestProviders());
  }

  FileCacheProvider.getInstance(injector).syncWithLocalFiles();

  return new ServiceApplication(injector);
}


export const createRandomFileName = (extension: string) => {
  return path.join(process.cwd(), String(Date.now()) + "." + extension);
}

export const removeWhitespace = (value: string) => {
  return value.replace(/[\s\r\n\t]+/g, "");
}