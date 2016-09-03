import { IRange } from "sf-core/geom";
import { diffArray } from "sf-core/utils/array";
import { ITreeNode, TreeNode } from "sf-core/tree";
import { IDisposable, IComparable, IPatchable } from "sf-core/object";

/**
 * represents a a part of a source string
 */

export interface IExpression extends ITreeNode<IExpression>, IComparable, IPatchable {
  position: IRange;
}

export abstract class BaseExpression<T extends BaseExpression<any>> extends TreeNode<T> implements IExpression {
  constructor(public position: IRange) {
    super();
  }
  patch(expression: IExpression) {
    // override me
  }
  compare(expression: IExpression): number {
    return Number(this.constructor === expression.constructor);
  }
}
