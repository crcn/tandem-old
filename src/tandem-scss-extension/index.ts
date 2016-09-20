import { scssFileDependency } from "./models";

import {
  scssImportEntityFactoryDependency
} from "./lang";

export const scssExtensionDependency = [

  // models
  scssFileDependency,

  // entities
  scssImportEntityFactoryDependency,

];

export * from "./models";
export * from "./lang";