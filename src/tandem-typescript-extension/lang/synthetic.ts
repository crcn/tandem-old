import * as ts from "typescript";
import { evaluateTypescript } from "./evaluator";
import {
  ISynthetic,
  ArrayEntity,
  SymbolTable,
  SyntheticKind,
  SyntheticObject,
  ISyntheticFunction,
  SyntheticValueObject,
  ISyntheticValueObject,
  IInstantiableSynthetic,
} from "tandem-common/lang/synthetic";

export * from "tandem-common/lang/synthetic";

export class SyntheticFunction extends SyntheticObject implements ISyntheticFunction {
  kind = SyntheticKind.Function;

  private _call: SyntheticCallFunction;

  constructor(private _expression: ts.FunctionLikeDeclaration, private _context: SymbolTable) {
    super();
    SyntheticObject.defineProperty(this, "call", {
      get: () => {
        return new SyntheticCallFunction(this._expression, this._context);
      }
    });

    SyntheticObject.defineProperty(this, "apply", {
      get: () => {
        return new SyntheticApplyFunction(this._expression, this._context);
      }
    });

    this.set("prototype", new SyntheticObject());
  }

  evaluate(args: Array<ISynthetic>): ISynthetic {
    const bodyContext = this._context.createChild();
    bodyContext.defineConstant("this", this.mapContext(args));
    const callArgs = this.mapArgs(args);
    const ctxArgs  = new SyntheticObject();

    this._expression.parameters.forEach((parameter, i) => {
      const varName = (<ts.Identifier>parameter.name).text;
      const value   = (parameter.dotDotDotToken ? new ArrayEntity(callArgs.slice(i)) : callArgs[i]) || new SyntheticValueObject(undefined);
      ctxArgs.set(varName, value);
      bodyContext.defineVariable(
        varName,
        value
      );
    });

    bodyContext.set("arguments", ctxArgs);

    return evaluateTypescript(this._expression.body, bodyContext).value;
  }

  apply(context: ISynthetic, args: Array<ISynthetic> = []) {
    return this.get("call").evaluate([context, ...args]);
  }

  protected mapContext(arg: Array<any>) {
    return this._context;
  }

  protected mapArgs(args: Array<any>) {
    return args;
  }

  createInstance(args: Array<ISynthetic>): ISynthetic {
    const instance = SyntheticObject.create(this.get("prototype"));
    this.apply(instance, args);
    return instance;
  }

  toJSON() {
    return { kind: SyntheticKind.Function, scriptText: this._expression.getText() };
  }
}

export class SyntheticCallFunction extends SyntheticFunction {
  mapContext(args: Array<any>) {
    return args[0];
  }
  mapArgs(args: Array<any>) {
    return args.slice(1);
  }
}

export class SyntheticApplyFunction extends SyntheticFunction {
  mapContext(args: Array<any>) {
    return args[0];
  }
  mapArgs(args: Array<any>) {
    return args[1] ? args[1].value || [] : [];
  }
}

export class SyntheticClass extends SyntheticObject implements IInstantiableSynthetic {
  constructor(private _expression: ts.ClassDeclaration, private _context: SymbolTable) {
    super();
  }

  createInstance(args: Array<ISynthetic>): ISynthetic {
    const instance = new SyntheticObject();
    const ctx = this._context.createChild();
    ctx.defineConstant("this", instance);
    for (const member of this._expression.members) {
      const value = evaluateTypescript(member, ctx).value;
      console.log(value);

      if (member.kind === ts.SyntaxKind.Constructor) {
        ctx.set("constructor", value);
      } else if (member.name) {
        ctx.set((<ts.Identifier>member.name).text, value);
      }
    }

    const ctor = <ISyntheticFunction>ctx.get("constructor");
    if (ctor) {
      ctor.apply(ctx, args);
    }

    return ctx;
  }
}