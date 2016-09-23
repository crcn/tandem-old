import { MimeTypes } from "../constants";
import * as ts from "typescript";
import { evaluateTypescript } from "./evaluator";
import {
  BaseModule,
  SymbolTable,
  EnvironmentKind,
  ModuleFactoryDependency,
} from "tandem-emulator";

class TSDOMModule extends BaseModule<any> {
  private _ast: ts.Node;
  constructor(fileName: string, content: string) {
    super(fileName, content);
    this._ast = ts.createSourceFile(fileName, content, ts.ScriptTarget.ES6);
  }
  async evaluate(context: SymbolTable) {
    return await evaluateTypescript(this._ast, context);
  }
}

export const tsDomModuleFactoryDependency = new ModuleFactoryDependency(EnvironmentKind.DOM, MimeTypes.TS, TSDOMModule);