import * as ts from "typescript";
import { MimeTypes } from "./constants";
import { MimeTypeDependency } from "tandem-common";

import {
  tsJsModuleFactoryDependency,
  tsDomModuleFactoryDependency,
} from "./runtime";

import {
  tsFileFactoryDependency
} from "./models";

export * from "./runtime";
export * from "./models";
export const typescriptExtensionDependency = [

  // models
  tsFileFactoryDependency,

  // module deps
  tsJsModuleFactoryDependency,
  tsDomModuleFactoryDependency,

  // mime types
  new MimeTypeDependency("ts", MimeTypes.TS),
  new MimeTypeDependency("tsx", MimeTypes.TS),
];

