import * as ts from "typescript";
import { MimeTypes } from "./constants";
import { MimeTypeDependency } from "tandem-common";

import {
  tsFileFactoryDependency
} from "./models";

export * from "./emulate";
export * from "./models";
export const typescriptExtensionDependency = [

  // models
  tsFileFactoryDependency,

  // mime types
  new MimeTypeDependency("ts", MimeTypes.TS),
  new MimeTypeDependency("tsx", MimeTypes.TS),
];

