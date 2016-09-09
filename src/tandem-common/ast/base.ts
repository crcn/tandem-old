import { IRange } from "tandem-common/geom";
import { patchable } from "tandem-common/decorators";
import { diffArray } from "tandem-common/utils/array";
import { IObservable } from "tandem-common/observable";
import { ITreeNode, TreeNode } from "tandem-common/tree";
import { IDisposable, IComparable, IPatchable } from "tandem-common/object";

export interface IExpressionSource {
  content: any;
}

/**
 * represents a a part of a source string
 */

export interface IExpression extends ITreeNode<IExpression>, IComparable {
  position: IRange;
  source: IExpressionSource;
}

const noSource = {
  content: ""
};

export interface IASTStringFormatter extends IObservable {
  expression: IExpression;
  content: string;
}

export abstract class BaseExpression<T extends BaseExpression<any>> extends TreeNode<T> implements IExpression {

  @patchable
  private _source: IExpressionSource;

  @patchable
  public position: IRange;

  constructor(position: IRange) {
    super();
    this.position = position || { start: -1, end: -1 };
  }

  get source(): IExpressionSource {
    return this._source;
  }

  set source(value: IExpressionSource) {
    this._source = value;
    for (const child of this.children) {
      child.source = value;
    }
  }

  compare(expression: IExpression): number {
    return Number(this.constructor === expression.constructor);
  }
}
