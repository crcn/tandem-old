import { MimeTypes } from "../constants";
import { TSJSModule } from "./js-module";
import {
  BaseModule,
  ModuleFactoryDependency,
} from "@tandem/common";


export const tsDomModuleFactoryDependency = new ModuleFactoryDependency("dom", MimeTypes.TS, TSJSModule);