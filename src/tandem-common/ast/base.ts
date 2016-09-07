import { IRange } from "tandem-common/geom";
import { patchable } from "tandem-common/decorators";
import { diffArray } from "tandem-common/utils/array";
import { ITreeNode, TreeNode } from "tandem-common/tree";
import { IDisposable, IComparable, IPatchable } from "tandem-common/object";

export interface IExpressionSource {
  content: any;
}

/**
 * represents a a part of a source string
 */

export interface IExpression extends ITreeNode<IExpression>, IComparable, IPatchable {
  position: IRange;
  source: IExpressionSource;
}

const noSource = {
  content: ""
};

export abstract class BaseExpression<T extends BaseExpression<any>> extends TreeNode<T> implements IExpression {

  @patchable
  private _source: IExpressionSource;

  @patchable
  readonly position: IRange;

  constructor(position: IRange) {
    super();
    this.position = position || { start: -1, end: -1 };
  }

  get source(): IExpressionSource {
    return this._source || (this.parent ? this.parent.source : undefined) || noSource;
  }

  set source(value: IExpressionSource) {
    this._source = value;
  }

  patch(expression: IExpression) {
    // override me
  }
  compare(expression: IExpression): number {
    return Number(this.constructor === expression.constructor);
  }

  // TODO -

  getWhitespaceBeforeStart() {
    return getReverseWhitespace(this.source.content.substr(0, this.position.start)) + getStartWhitespace(this.getSourcePart());
  }

  getSourcePart() {
    return this.source.content.substr(this.position.start, this.position.end - this.position.start);
  }

  getWhitespaceAfterEnd() {
    return getReverseWhitespace(this.getSourcePart()) + getStartWhitespace(this.source.content.substr(this.position.end));
  }

  isEOF() {
    return this.position.end === this.source.content.length;
  }
}

function getStartWhitespace(str: string) {
  const search = /^[\s\r\n\t]+/;
  const match  = str.match(search);
  return match ? match[0] : "";
}

function getReverseWhitespace(str: string) {
  const search = /[\s\r\n\t]+$/;
  const match  = str.match(search);
  return match ? match[0] : "";
}

