import { MimeTypes } from "./constants";
import { scssFileDependency } from "./models";
import { MimeTypeDependency } from "tandem-common";
import { jsSCSSModuleFactoryDependency } from "./emulate";

import {
  scssImportEntityFactoryDependency
} from "./lang";

export const scssExtensionDependency = [

  // models
  scssFileDependency,

  // entities
  scssImportEntityFactoryDependency,

  jsSCSSModuleFactoryDependency,

  new MimeTypeDependency("scss", MimeTypes.SCSS)
];

export * from "./lang";
export * from "./models";
export * from "./emulate";