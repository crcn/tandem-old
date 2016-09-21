import * as ts from "typescript";
import { evaluateTypescript } from "./evaluator";
import { SymbolTable, EntityKind, IEntity, ILiteralEntity, ArrayEntity, LiteralEntity, IFunctionEntity } from "tandem-common/lang/entities2";

export * from "tandem-common/lang/entities2";

export class FunctionEntity implements IFunctionEntity {
  kind = EntityKind.Function;

  private _call: CallFunctionEntity;

  constructor(private _expression: ts.FunctionLikeDeclaration, private _context: SymbolTable) { }
  get(key: string) {
    if (key === "call") return new CallFunctionEntity(this._expression, this._context);
    if (key === "apply") return new ApplyFunctionEntity(this._expression, this._context);
    return this[key];
  }

  set(propertyName: string, value: any) {
    this[propertyName] = value;
  }

  evaluate(args: Array<any>): IEntity {
    const bodyContext = this._context.createChild();
    bodyContext.defineConstant("this", this.mapContext(args));
    const callArgs = this.mapArgs(args);
    this._expression.parameters.forEach((parameter, i) => {
      const value = parameter.dotDotDotToken ? new ArrayEntity(callArgs.slice(i)) : callArgs[i];
      bodyContext.defineVariable(
        (<ts.Identifier>parameter.name).text,
        value
      );
    });
    return evaluateTypescript(this._expression.body, bodyContext).value;
  }

  protected mapContext(arg: Array<any>) {
    return this._context;
  }

  protected mapArgs(args: Array<any>) {
    return args;
  }

  toJSON() {
    return { kind: EntityKind.Function, scriptText: this._expression.getText() };
  }
}

export class CallFunctionEntity extends FunctionEntity {
  mapContext(args: Array<any>) {
    return args[0];
  }
  mapArgs(args: Array<any>) {
    return args.slice(1);
  }
}

export class ApplyFunctionEntity extends FunctionEntity {
  mapContext(args: Array<any>) {
    return args[0];
  }
  mapArgs(args: Array<any>) {
    return args[1] ? args[1].value || [] : [];
  }
}