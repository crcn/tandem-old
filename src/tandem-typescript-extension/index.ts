import * as ts from "typescript";
import { MimeTypes } from "./constants";
import { MimeTypeDependency } from "tandem-common";

import  {
  tsRootEntityFactoryDependency,
  tsFunctionDeclarationEntityFactoryDependency,
} from "./ast";

import {
  tsFileFactoryDependency
} from "./models";

export * from "./ast";
export * from "./models";
export const typescriptExtensionDependency = [

  // models
  tsFileFactoryDependency,

  // entities
  tsRootEntityFactoryDependency,
  tsFunctionDeclarationEntityFactoryDependency,

  // mime types
  new MimeTypeDependency("ts", MimeTypes.TS),
  new MimeTypeDependency("tsx", MimeTypes.TS),
];

