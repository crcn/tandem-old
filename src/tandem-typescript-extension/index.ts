import * as ts from "typescript";
import * as es from "esprima";

let result = ts.transpileModule(`<div>`, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.React
  }
});

console.log("parsing %s", result.outputText);

const ast = es.parse(result.outputText);

console.log(ast);


export const typescriptExtensionDependency = [];

