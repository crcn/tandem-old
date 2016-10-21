import { SASS_MIME_TYPE } from "./constants";
import { CSSEditor } from "@tandem/html-extension";
import { SCSSModule, HTMLSCSSDOMModule, SCSSLoader } from "./sandbox";
import { MimeTypeDependency, JS_MIME_TYPE, CSS_MIME_TYPE, HTML_MIME_TYPE } from "@tandem/common";
import { SandboxModuleFactoryDependency, BundlerLoaderFactoryDependency, ContentEditorFactoryDependency } from "@tandem/sandbox";

export const sassExtensionDependencies = [
  new BundlerLoaderFactoryDependency(SASS_MIME_TYPE, SCSSLoader),
  new SandboxModuleFactoryDependency(CSS_MIME_TYPE, SASS_MIME_TYPE, SCSSModule),
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, SASS_MIME_TYPE, SCSSModule),
  new SandboxModuleFactoryDependency(JS_MIME_TYPE, SASS_MIME_TYPE, HTMLSCSSDOMModule),
  new ContentEditorFactoryDependency(SASS_MIME_TYPE, CSSEditor),
  new MimeTypeDependency("scss", SASS_MIME_TYPE)
];
