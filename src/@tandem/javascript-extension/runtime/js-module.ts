import {
  MimeTypes,
  CommonJSModule,
  ModuleFactoryDependency,
} from "@tandem/common";

export const jsModuleFactoryDependency = new ModuleFactoryDependency(MimeTypes.JavaScript, MimeTypes.JavaScript, CommonJSModule);