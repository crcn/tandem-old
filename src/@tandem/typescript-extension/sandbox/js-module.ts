import * as ts from "typescript";
import { BaseModule, CommonJSModule, ModuleFactoryDependency } from "@tandem/sandbox";

export class TSJSModule extends CommonJSModule {
  transpile() {
    return ts.transpile(this.content, {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React
    }, this.fileName);
  }
}
