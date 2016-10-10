import { SCSSModule } from "./sandbox";
import { SASS_MIME_TYPE } from "./constants";
import { ModuleFactoryDependency } from "@tandem/sandbox";
import { MimeTypeDependency, CSS_MIME_TYPE } from "@tandem/common";

export const sassExtensionDependency = [
  new ModuleFactoryDependency(CSS_MIME_TYPE, SASS_MIME_TYPE, SCSSModule),
  new MimeTypeDependency("scss", SASS_MIME_TYPE)
];
