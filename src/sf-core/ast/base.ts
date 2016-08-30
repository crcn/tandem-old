import { IRange } from "sf-core/geom";
import { diffArray } from"sf-core/utils/array";
import { IDisposable } from "sf-core/object";
import * as diff from "diff";

/**
 * represents a a part of a source string
 */

export interface IExpression {
  position: IRange;
}

export abstract class BaseExpression implements IExpression {
  constructor(public position: IRange) { }
}



export function patchSource(content: string, oldAst: IExpression, modAst: IExpression) {

  // const oldExpressions = oldAst.flatten().reverse();
  // const modExpressions = modAst.flatten().reverse();

  // const modBuffs = modExpressions.map((expr) => expr.toString());

  return modAst.toString();
}