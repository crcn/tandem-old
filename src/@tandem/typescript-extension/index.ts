import * as ts from "typescript";
import { TSJSModule } from "./sandbox";
import { TS_MIME_TYPE } from "./constants";
import { SandboxModuleFactoryDependency } from "@tandem/sandbox";
import { MimeTypeDependency, JS_MIME_TYPE, HTML_MIME_TYPE } from "@tandem/common";

export const typescriptExtensionDependencies = [

  // module deps
  new SandboxModuleFactoryDependency(JS_MIME_TYPE, TS_MIME_TYPE, TSJSModule),
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, TS_MIME_TYPE, TSJSModule),

  // mime types
  new MimeTypeDependency("ts", TS_MIME_TYPE),
  new MimeTypeDependency("tsx", TS_MIME_TYPE),
];

export * from "./sandbox";
export * from "./constants";