import "./entry-shims";

import { Dependencies } from "@tandem/common";
import { ServiceApplication } from "./core";
import { createHTMLEditorServerDependencies } from "@tandem/html-extension/editor/server";
import { createSASSEditorServerDependencies } from "@tandem/sass-extension/editor/server";
import { IEdtorServerConfig, concatEditorServerDependencies } from "./server";

const config: IEdtorServerConfig = { };

const deps = new Dependencies(
  createHTMLEditorServerDependencies(),
  createSASSEditorServerDependencies()
);

const app = new ServiceApplication(
  concatEditorServerDependencies(deps, config)
);

app.initialize();