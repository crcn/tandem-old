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

/**
 * represents a a part of a source string
 */

export interface IASTNode extends ITreeNode<IASTNode>, IComparable {
  position: IRange;
  source: IASTNodeSource;
}

const noSource = {
  content: ""
};


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

