import { IRange } from "sf-core/geom";
import { diffArray } from "sf-core/utils/array";
import { IDisposable } from "sf-core/object";
import { ITreeNode, TreeNode } from "sf-core/tree";

/**
 * represents a a part of a source string
 */

export interface IExpression extends ITreeNode<IExpression> {
  position: IRange;
  type: string;
}

export abstract class BaseExpression extends TreeNode<BaseExpression> implements IExpression {
  constructor(public type: string, public position: IRange) {
    super();
  }
}
