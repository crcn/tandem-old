import { argv } from "yargs";
import * as getPort from "get-port";
import { SockService } from "@tandem/editor/server";
import { isMaster, fork, addListener, emit } from "cluster";
import { ServiceApplication, ApplicationServiceProvider } from "@tandem/core";
import { Injector, LogLevel, serialize, deserialize, PrivateBusProvider } from "@tandem/common";
import { createJavaScriptWorkerProviders } from "@tandem/javascript-extension/editor/worker";
import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/worker";
import { createHTMLEditorWorkerProviders } from "@tandem/html-extension/editor/worker";
import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/worker";
import { createSyntheticBrowserWorkerProviders } from "@tandem/synthetic-browser";
import { createEditorWorkerProviders, IEditorWorkerConfig } from "@tandem/editor/worker";

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
    createSyntheticBrowserWorkerProviders(),
    createTypescriptEditorWorkerProviders(),
    createEditorWorkerProviders(config),
    new ApplicationServiceProvider("sock", SockService)
  );

  const app = new ServiceApplication(injector);
  await app.initialize();
}