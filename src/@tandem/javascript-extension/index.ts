import { MimeTypeDependency, JS_MIME_TYPE } from "@tandem/common";
import { CommonJSModule, ModuleFactoryDependency } from "@tandem/sandbox";

export const javascriptExtensionDependency = [
  new ModuleFactoryDependency(JS_MIME_TYPE, JS_MIME_TYPE, CommonJSModule),
  new MimeTypeDependency("js", JS_MIME_TYPE)
];
