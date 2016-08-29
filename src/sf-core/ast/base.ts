import { IRange } from "sf-core/geom";
import { IDisposable } from "sf-core/object";

/**
 * represents a a part of a source string
 */

export interface IExpression {
  position: IRange;
}

export abstract class BaseExpression implements IExpression {
  constructor(public position: IRange) { }
}
