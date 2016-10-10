import { TSJSModule } from "./js-module";
import { TS_MIME_TYPE } from "../constants";
import { HTML_MIME_TYPE, JS_MIME_TYPE } from "@tandem/common";

import {
  BaseModule,
  ModuleFactoryDependency,
} from "@tandem/sandbox";

export const tsDomModuleFactoryDependency = new ModuleFactoryDependency(HTML_MIME_TYPE, TS_MIME_TYPE, TSJSModule);