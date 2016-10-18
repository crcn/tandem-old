import * as ts from "typescript";
import { BaseSandboxModule, SandboxModuleFactoryDependency } from "@tandem/sandbox";
import { CommonJSSandboxModule } from "@tandem/javascript-extension";

export class TSJSModule extends CommonJSSandboxModule {
  transpile() {
    return ts.transpile(this.content, {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES6,
      jsx: ts.JsxEmit.React
    }, this.filePath);
  }
}

