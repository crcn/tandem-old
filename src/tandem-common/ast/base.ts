import { IRange } from "tandem-common/geom";
import { diffArray } from "tandem-common/utils/array";
import { ITreeNode, TreeNode } from "tandem-common/tree";
import { IDisposable, IComparable, IPatchable } from "tandem-common/object";

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
