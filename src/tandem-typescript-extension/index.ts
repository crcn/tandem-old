import * as ts from "typescript";
import { MimeTypes } from "./constants";
import { MimeTypeDependency } from "tandem-common";

import  {
  tsRootEntityFactoryDependency,
  tsCallEntityFactoryDependency,
  tsEmptyEntityFactoryDependency,
  tsStatementEntityFactoryDependency,
  tsFunctionDeclarationEntityFactoryDependency,
} from "./lang";

import {
  tsFileFactoryDependency
} from "./models";

export * from "./lang";
export * from "./models";
export const typescriptExtensionDependency = [

  // models
  tsFileFactoryDependency,

  // entities
  tsRootEntityFactoryDependency,
  tsCallEntityFactoryDependency,
  tsEmptyEntityFactoryDependency,
  tsStatementEntityFactoryDependency,
  tsFunctionDeclarationEntityFactoryDependency,

  // mime types
  new MimeTypeDependency("ts", MimeTypes.TS),
  new MimeTypeDependency("tsx", MimeTypes.TS),
];

