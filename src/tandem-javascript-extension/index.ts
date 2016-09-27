import { jsModuleFactoryDependency } from "./runtime";
import { MimeType } from "./constants";
import { MimeTypeDependency } from "tandem-common";

export const javascriptExtensionDependency = [
  jsModuleFactoryDependency,
  new MimeTypeDependency("js", MimeType.JS)
];