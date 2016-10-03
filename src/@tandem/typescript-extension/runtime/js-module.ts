import * as ts from "typescript";
import { MimeTypes } from "../constants";
import {
  BaseModule,
  CommonJSModule,
  ModuleFactoryDependency,
} from "@tandem/common";

export class TSJSModule extends CommonJSModule {
  transpile() {
    return ts.transpile(this.content, {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React
    }, this.fileName);
  }
}

export const tsJsModuleFactoryDependency = new ModuleFactoryDependency(MimeTypes.JS, MimeTypes.TS, TSJSModule);