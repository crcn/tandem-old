import {
  MimeTypes,
} from "@tandem/common";

import {
  CommonJSModule,
  ModuleFactoryDependency,
} from "@tandem/sandbox";

export const jsModuleFactoryDependency = new ModuleFactoryDependency(MimeTypes.JavaScript, MimeTypes.JavaScript, CommonJSModule);