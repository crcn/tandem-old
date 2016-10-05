import { MimeTypes } from "./constants";
import { sassFileDependency } from "./models";
import { MimeTypeDependency } from "@tandem/common";
import { jsSassModuleFactoryDependency } from "./runtime";

import {
  sassImportEntityFactoryDependency
} from "./lang";

export const sassExtensionDependency = [

  // models
  sassFileDependency,

  // entities
  sassImportEntityFactoryDependency,

  jsSassModuleFactoryDependency,

  new MimeTypeDependency("sass", MimeTypes.Sass)
];

export * from "./lang";
export * from "./models";
export * from "./runtime";