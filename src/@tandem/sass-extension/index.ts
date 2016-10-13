import { SCSSModule, HTMLSCSSDOMModule } from "./sandbox";
import { SASS_MIME_TYPE } from "./constants";
import { SandboxModuleFactoryDependency } from "@tandem/sandbox";
import { MimeTypeDependency, JS_MIME_TYPE, CSS_MIME_TYPE, HTML_MIME_TYPE } from "@tandem/common";

export const sassExtensionDependencies = [
  new SandboxModuleFactoryDependency(CSS_MIME_TYPE, SASS_MIME_TYPE, SCSSModule),
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, SASS_MIME_TYPE, SCSSModule),
  new SandboxModuleFactoryDependency(JS_MIME_TYPE, SASS_MIME_TYPE, HTMLSCSSDOMModule),
  new MimeTypeDependency("scss", SASS_MIME_TYPE)
];
