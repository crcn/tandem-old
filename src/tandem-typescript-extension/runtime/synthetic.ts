import * as ts from "typescript";
import { evaluateTypescript } from "./evaluator";
import {
  ISynthetic,
  SyntheticArray,
  SymbolTable,
  SyntheticKind,
  NativeFunction,
  SyntheticObject,
  ISyntheticFunction,
  SyntheticValueObject,
  mapNativeAsSynthetic,
  ISyntheticValueObject,
  IInstantiableSynthetic,
  SyntheticBaseFunction,
} from "tandem-runtime";

export class SyntheticFunction extends SyntheticBaseFunction implements ISyntheticFunction {
  kind = SyntheticKind.Function;

  constructor(private _expression: ts.FunctionLikeDeclaration, private _context: SymbolTable, name?: string) {
    super(name);
  }

  apply(context: ISynthetic, args: Array<ISynthetic> = []): ISynthetic {

    const bodyContext = this._context.createChild();
    bodyContext.defineConstant("this", context);
    const ctxArgs  = new SyntheticArray();

    this._expression.parameters.forEach((parameter, i) => {
      const varName = (<ts.Identifier>parameter.name).text;
      const value   = (parameter.dotDotDotToken ? new SyntheticArray(...args.slice(i)) : args[i]) || new SyntheticValueObject(undefined);
      ctxArgs.push(value);
      bodyContext.defineVariable(
        varName,
        value
      );
    });

    bodyContext.set("arguments", ctxArgs);

    return evaluateTypescript(this._expression.body, bodyContext).value || new SyntheticValueObject(undefined);
  }

  toNative() {
    return (...args: any[]) => {
      return this.apply(mapNativeAsSynthetic(this), args.map((value) => mapNativeAsSynthetic(value))).toNative();
    };
  }

  toString() {
    return this._expression.getText();
  }

  toJSON() {
    return { kind: SyntheticKind.Function, scriptText: this._expression.getText() };
  }
}

export class SyntheticClass extends SyntheticObject implements IInstantiableSynthetic {
  constructor(private _expression: ts.ClassDeclaration, private _context: SymbolTable, name?: string) {
    super();
    this.set("name", new SyntheticValueObject(name));
  }

  toNative() {

    // TODO
    return function() {

    };
  }

  createInstance(args: Array<ISynthetic>): ISynthetic {
    const initialProperties = {};
    let constructor;
    for (const member of this._expression.members) {
      const value = evaluateTypescript(member, this._context).value;
      if (value == null) continue;

      if (member.kind === ts.SyntaxKind.Constructor) {
        constructor = value;
      } else if (member.name) {
        initialProperties[(<ts.Identifier>member.name).text] =  value;
      }
    }

    const instance = new SyntheticObject(initialProperties);

    if (constructor) {
      constructor.apply(instance, args);
    }

    return instance;
  }
}