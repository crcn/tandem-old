import * as ts from "typescript";
import { MimeTypes } from "../constants";
import { evaluateTypescript } from "./evaluator";
import {
  BaseModule,
  SymbolTable,
  EnvironmentKind,
  SyntheticObject,
  ModuleFactoryDependency,
} from "@tandem/runtime";

export class TSJSModule extends BaseModule<any> {
  private _ast: ts.Node;
  constructor(fileName: string, content: string) {
    super(fileName, content);
    this._ast = ts.createSourceFile(fileName, content, ts.ScriptTarget.ES6, true);
  }
  async evaluate(context: SymbolTable) {
    return await evaluateTypescript(this._ast, context);
  }
}

export const tsJsModuleFactoryDependency = new ModuleFactoryDependency(EnvironmentKind.JavaScript, MimeTypes.TS, TSJSModule);