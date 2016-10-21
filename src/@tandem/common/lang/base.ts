import { IRange } from "@tandem/common/geom";
import { patchable } from "@tandem/common/decorators";
import { diffArray } from "@tandem/common/utils/array";
import { ITreeNode, TreeNode } from "@tandem/common/tree";
import { IObservable, Observable } from "@tandem/common/observable";
import { IDisposable, IComparable, IPatchable } from "@tandem/common/object";

export interface IASTNodeSource {
  offset?: number;
  content: any;
}

export interface IASTNodeLoader extends IObservable {
  load(source: IASTNodeSource): IASTNode;
}

export interface ISourcePosition {
  line: number;
  column: number;
}

export interface ISourceLocation {
  start?: ISourcePosition;
  end?: ISourcePosition;
}

/**
 * represents a a part of a source string
 */

export interface IASTNode extends ITreeNode<IASTNode>, IComparable {
  position: IRange;
  source: IASTNodeSource;
}

export interface IASTNode2 {
  parent: IASTNode2;
  readonly kind: number;
  position: IRange;
  accept(visitor);
}


export interface IExpression extends IASTNode2 {
  position: IRange;
}

const noSource = {
  content: ""
};

// DEPRECATED
export abstract class BaseASTNode<T extends BaseASTNode<any>> extends TreeNode<T> implements IASTNode {

  @patchable()
  private _source: IASTNodeSource;

  @patchable()
  public position: IRange;

  constructor(position: IRange) {
    super();
    this.position = position || { start: -1, end: -1 };
  }

  inRange(selection: IRange) {
    const offset = this.source.offset || 0;
    const start = this.position.start + offset;
    const end   = this.position.end + offset;

    return (selection.start >= start && selection.start <= end) ||
    (selection.end   >= start && selection.end <= end) ||
    (selection.start <= start && selection.end >= end);
  }

  get source(): IASTNodeSource {
    return this._source;
  }

  set source(value: IASTNodeSource) {
    this._source = value;
    for (const child of this.children) {
      child.source = value;
    }
  }

  compare(node: IASTNode): number {
    return Number(this.constructor === node.constructor);
  }
}


export abstract class BaseExpression implements IExpression {

  abstract readonly kind: number;

  public parent: IASTNode2;
  public position: IRange;
  public offset: number = 0;

  constructor(position: IRange) {
    this.position = position;
  }

  inRange(selection: IRange) {
    const offset = this.offset;
    const start = this.position.start + offset;
    const end   = this.position.end + offset;

    return (selection.start >= start && selection.start <= end) ||
    (selection.end   >= start && selection.end <= end) ||
    (selection.start <= start && selection.end >= end);
  }

  abstract accept(visitor);
}

