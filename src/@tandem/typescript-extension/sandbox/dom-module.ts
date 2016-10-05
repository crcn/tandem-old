import { MimeTypes } from "../constants";
import { TSJSModule } from "./js-module";
import {
  MimeTypes as CommonMimeTypes
} from "@tandem/common";

import {
  BaseModule,
  ModuleFactoryDependency,
} from "@tandem/sandbox";

export const tsDomModuleFactoryDependency = new ModuleFactoryDependency(CommonMimeTypes.HTML, MimeTypes.TS, TSJSModule);