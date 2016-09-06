import { scssFileDependency } from "./models";

import {
  scssImportEntityFactoryDependency
} from "./ast";

export const scssExtensionDependency = [

  // models
  scssFileDependency,

  // entities
  scssImportEntityFactoryDependency,

];