import { MimeTypeDependency, JS_MIME_TYPE } from "@tandem/common";
import { CommonJSSandboxModule, SandboxModuleFactoryDependency } from "@tandem/sandbox";

export const javascriptExtensionDependencies = [
  new SandboxModuleFactoryDependency(JS_MIME_TYPE, JS_MIME_TYPE, CommonJSSandboxModule),
  new MimeTypeDependency("js", JS_MIME_TYPE)
];
