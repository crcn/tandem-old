import "./entry-shims";

import { argv } from "yargs";
import { Dependencies } from "@tandem/common";
import { ServiceApplication } from "./core";
import { createHTMLEditorServerDependencies } from "@tandem/html-extension/editor/server";
// import { createSASSEditorServerDependencies } from "@tandem/sass-extension/editor/server";
import { IEdtorServerConfig, concatEditorServerDependencies } from "./server";

const config: IEdtorServerConfig = {
  argv: argv,
  cwd: process.cwd()
};

const deps = new Dependencies(
  createHTMLEditorServerDependencies()
);

const app = new ServiceApplication(
  concatEditorServerDependencies(deps, config)
);

app.initialize();

process.on("unhandledRejection", function(error) {
  console.log("unhandled rejection", error);
});