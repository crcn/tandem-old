import { MimeTypes } from "./constants";
import { MimeTypeDependency } from "@tandem/common";
import { scssModuleFactoryDependency } from "./sandbox";


export const sassExtensionDependency = [

  // models
  scssModuleFactoryDependency,

  new MimeTypeDependency("scss", MimeTypes.Sass)
];
