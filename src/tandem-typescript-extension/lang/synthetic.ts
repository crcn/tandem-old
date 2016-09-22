import * as ts from "typescript";
import { evaluateTypescript } from "./evaluator";
import { SymbolTable, SyntheticKind, ISynthetic, ISyntheticValueObject, ArrayEntity, SyntheticValueObject, ISyntheticFunction } from "tandem-common/lang/synthetic";

export * from "tandem-common/lang/synthetic";

// change to virtual

export class FunctionEntity implements ISyntheticFunction {
  kind = SyntheticKind.Function;

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

  evaluate(args: Array<any>): ISynthetic {
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
    return { kind: SyntheticKind.Function, scriptText: this._expression.getText() };
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