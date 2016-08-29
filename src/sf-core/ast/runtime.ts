import { IExpression } from "./base";
import { Dependencies } from "sf-core/dependencies";

/**
 * Runtime engine for executing AST expressions
 */

export class Runtime {

  private _ast: IExpression;

  constructor(private _dependencies: Dependencies) {

  }

  async load(ast: IExpression) {
    this._ast = ast;

  }
}