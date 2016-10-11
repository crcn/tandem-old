import * as ts from "typescript";
import { BaseSandboxModule, CommonJSSandboxModule, SandboxModuleFactoryDependency } from "@tandem/sandbox";

export class TSJSModule extends CommonJSSandboxModule {
  transpile() {
    return ts.transpile(this.content, {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React
    }, this.fileName);
  }
}
