import * as ts from "typescript";
import { TSJSModule } from "./sandbox";
import { TS_MIME_TYPE } from "./constants";
import { ModuleFactoryDependency } from "@tandem/sandbox";
import { MimeTypeDependency, JS_MIME_TYPE, HTML_MIME_TYPE } from "@tandem/common";

export const typescriptExtensionDependency = [

  // module deps
  new ModuleFactoryDependency(JS_MIME_TYPE, TS_MIME_TYPE, TSJSModule),
  new ModuleFactoryDependency(HTML_MIME_TYPE, TS_MIME_TYPE, TSJSModule),

  // mime types
  new MimeTypeDependency("ts", TS_MIME_TYPE),
  new MimeTypeDependency("tsx", TS_MIME_TYPE),
];

export * from "./sandbox";
export * from "./constants";