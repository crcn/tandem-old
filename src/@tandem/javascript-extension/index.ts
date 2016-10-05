import { jsModuleFactoryDependency } from "./sandbox";
import { MimeType } from "./constants";
import { MimeTypeDependency } from "@tandem/common";

export const javascriptExtensionDependency = [
  jsModuleFactoryDependency,
  new MimeTypeDependency("js", MimeType.JS)
];