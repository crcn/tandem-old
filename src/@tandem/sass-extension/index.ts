import { SCSSModule, HTMLSCSSDOMModule, SCSSLoader } from "./sandbox";
import { SASS_MIME_TYPE } from "./constants";
import { SandboxModuleFactoryDependency, BundlerLoaderFactoryDependency } from "@tandem/sandbox";
import { MimeTypeDependency, JS_MIME_TYPE, CSS_MIME_TYPE, HTML_MIME_TYPE } from "@tandem/common";

export const sassExtensionDependencies = [
  new BundlerLoaderFactoryDependency(SASS_MIME_TYPE, SCSSLoader),
  new SandboxModuleFactoryDependency(CSS_MIME_TYPE, SASS_MIME_TYPE, SCSSModule),
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, SASS_MIME_TYPE, SCSSModule),
  new SandboxModuleFactoryDependency(JS_MIME_TYPE, SASS_MIME_TYPE, HTMLSCSSDOMModule),
  new MimeTypeDependency("scss", SASS_MIME_TYPE)
];
