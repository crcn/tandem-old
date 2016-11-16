import { argv } from "yargs";
import * as getPort from "get-port";
import { SockService } from "@tandem/editor/server";
import { createJavaScriptWorkerProviders } from "@tandem/javascript-extension/editor/worker";
import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/worker";
import { createHTMLEditorWorkerProviders } from "@tandem/html-extension/editor/worker";
import { isMaster, fork, addListener, emit } from "cluster";
import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/worker";
import { createSyntheticBrowserWorkerProviders } from "@tandem/synthetic-browser";
import { ServiceApplication, ApplicationServiceProvider } from "@tandem/core";
import { createEditorWorkerProviders, IEditorWorkerConfig } from "@tandem/editor/worker";
import { Injector, LogLevel, serialize, deserialize, PrivateBusProvider, hook } from "@tandem/common";

export const initializeWorker = async () => {

  const config: IEditorWorkerConfig = {
    log: {
      level: LogLevel.ALL,
      prefix: "worker "
    }
  };

  const injector = new Injector(
    createHTMLEditorWorkerProviders(),
    createSASSEditorWorkerProviders(),
    createJavaScriptWorkerProviders(),
    createEditorWorkerProviders(config),
    createSyntheticBrowserWorkerProviders(),
    createTypescriptEditorWorkerProviders()
  );

  const app = new ServiceApplication(injector);

  // hook with the master process
  app.bus.register(hook(app.bus));

  await app.initialize();
}