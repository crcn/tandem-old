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
  constructor(readonly source: string, readonly position: IRange) {
    super();
    if (!position) this.position = { start: -1, end: -1 };
    if (!source) this.source = "";
  }
  patch(expression: IExpression) {
    // override me
  }
  compare(expression: IExpression): number {
    return Number(this.constructor === expression.constructor);
  }

  getWhitespaceBeforeStart() {
    return getReverseWhitespace(this.source.substr(0, this.position.start)) + getStartWhitespace(this.getSourcePart());
  }

  getSourcePart() {
    return this.source.substr(this.position.start, this.position.end - this.position.start);
  }

  getWhitespaceAfterEnd() {
    return getReverseWhitespace(this.getSourcePart()) + getStartWhitespace(this.source.substr(this.position.end));
  }

  isEOF() {
    return this.position.end === this.source.length;
  }
}

function getStartWhitespace(str: string) {
  const search = /^[\s\r\n\t]+/g;
  const match  = str.match(search);
  return match ? match[0] : "";
}

function getReverseWhitespace(str: string) {
  return reverseString(getStartWhitespace(reverseString(str)));
}


function reverseString(str: string) {
  return str.split("").reverse().join("");
}
