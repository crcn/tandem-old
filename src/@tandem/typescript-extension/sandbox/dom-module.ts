import { TSJSModule } from "./js-module";
import { TS_MIME_TYPE } from "../constants";
import { HTML_MIME_TYPE, JS_MIME_TYPE } from "@tandem/common";

import {
  BaseSandboxModule,
  SandboxModuleFactoryDependency,
} from "@tandem/sandbox";

export const tsDomSandboxModuleFactoryDependency = new SandboxModuleFactoryDependency(HTML_MIME_TYPE, TS_MIME_TYPE, TSJSModule);