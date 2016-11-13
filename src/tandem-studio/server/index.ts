import { argv } from "yargs";
import * as getPort from "get-port";
import { Injector, LogLevel } from "@tandem/common";
import { ServiceApplication } from "@tandem/core";
import { createJavaScriptWorkerProviders } from "@tandem/javascript-extension/editor/server";
import { createSASSEditorWorkerProviders } from "@tandem/sass-extension/editor/server";
import { createTDProjectEditorServerProviders } from "@tandem/tdproject-extension/editor/server";
import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/server";
import { createEditorServerProviders, IEdtorServerConfig, MongoDS } from "@tandem/editor/server";
import { createSyntheticBrowserWorkerProviders } from "@tandem/synthetic-browser";
import { createHTMLEditorWorkerProviders, createHTMLEditorServerProviders } from "@tandem/html-extension/editor/server";

export const initialize = async (port?: number) => {

  const config: IEdtorServerConfig = {
    logLevel: LogLevel.ALL,
    cwd: process.cwd(),
    experimental: true,
    hostname: "localhost",
    port: port || await getPort(),
    argv: argv
  }

  const injector = new Injector(
    createHTMLEditorWorkerProviders(),
    createHTMLEditorServerProviders(),
    createSASSEditorWorkerProviders(),
    createJavaScriptWorkerProviders(),
    createEditorServerProviders(config, new MongoDS("mongodb://localhost:27017/tandem")),
    createTDProjectEditorServerProviders(),
    createSyntheticBrowserWorkerProviders(),
    createTypescriptEditorWorkerProviders(),
  )

  const app = new ServiceApplication(injector);
  await app.initialize();
}



