import "./entry-shims";

import { argv } from "yargs";
import { Dependencies } from "@tandem/common";
import { ServiceApplication } from "@tandem/core";
import { IEdtorServerConfig, concatEditorServerDependencies } from "./server";

// extensions
import { createSASSEditorWorkerDependencies } from "@tandem/sass-extension/editor/worker";
import { createSyntheticBrowserWorkerDependencies } from "@tandem/synthetic-browser";
import { createTDProjectEditorServerDependencies } from "@tandem/tdproject-extension/editor/server";
// import { createTDProjectEditorBrowserDependencies } from "@tandem/tdproject-extension/editor/browser";
import { createHTMLEditorServerDependencies, createHTMLEditorWorkerDependencies } from "@tandem/html-extension/editor/server";


const config: IEdtorServerConfig = {
  argv: argv,
  cwd: process.cwd(),
  entries: {
    editor: require.resolve(require('./package.json').browser)
  }
};

const deps = new Dependencies(
  createHTMLEditorServerDependencies(),

  // worker deps
  createHTMLEditorWorkerDependencies(),
  createSASSEditorWorkerDependencies(),
  createSyntheticBrowserWorkerDependencies(),
  createTDProjectEditorServerDependencies()
);

const app = new ServiceApplication(
  concatEditorServerDependencies(deps, config)
);

app.initialize();

process.on("unhandledRejection", function(error) {
  console.log("unhandled rejection", error);
});