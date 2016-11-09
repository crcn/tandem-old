// TODO - giant mess of a setup here. This is okay for now as
// the internal API matures along with extensions. However, it *may* be good
// to modularize this piece of code later so that it's not so specific to certain libraries
// such as typescript, and sass.

import * as path from "path";
import { createSASSSandboxProviders } from "@tandem/sass-extension";
import { createCoreApplicationProviders } from "@tandem/core";
import { createJavaScriptSandboxProviders } from "@tandem/javascript-extension";
import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/worker";
import { createHTMLCoreProviders, createHTMLSandboxProviders } from "@tandem/html-extension";
import { createTestSandboxProviders, ISandboxTestProviderOptions } from "@tandem/sandbox/test/helpers";
import { Injector, InjectorProvider, PrivateBusProvider, BrokerBus, Application } from "@tandem/common";
import { WebpackDependencyGraphStrategy, DependencyGraphStrategyProvider, FileCacheProvider } from "@tandem/sandbox";


/**
 * creates a test master application that includes everything from the front-end
 * back-end, and workers.
 */

export interface IMasterTestAppicationOptions {
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
    createJavaScriptSandboxProviders(),
    createTypescriptEditorWorkerProviders(),
    createTestSandboxProviders(options.sandboxOptions),
    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
  );

  if (options.createTestProviders) {
    injector.register(options.createTestProviders());
  }

  FileCacheProvider.getInstance(injector).syncWithLocalFiles();

  const app = new Application(injector);

  return app;
}


export const createRandomFileName = (extension: string) => {
  return path.join(process.cwd(), String(Date.now()), "." + extension);
}