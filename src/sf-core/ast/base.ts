import { IRange } from "sf-core/geom";
import { diffArray } from"sf-core/utils/array";
import { IDisposable } from "sf-core/object";

/**
 * represents a a part of a source string
 */

export interface IExpression {
  position: IRange;
  type: string;
}

export abstract class BaseExpression implements IExpression {
  constructor(public type: string, public position: IRange) {
  }
}
