import { IRange } from "sf-core/geom";
import { diffArray } from"sf-core/utils/array";
import { IDisposable } from "sf-core/object";

/**
 * represents a a part of a source string
 */

export interface IExpression {
  position: IRange;
  flatten(): Array<IExpression>;
}

export abstract class BaseExpression implements IExpression {
  constructor(public position: IRange) { }
  flatten(): Array<IExpression> {
     const items = [];
     this._flattenDeep(items);
     return items;
  }
  public _flattenDeep(items: Array<BaseExpression>) {
    items.push(this);
  }
}

