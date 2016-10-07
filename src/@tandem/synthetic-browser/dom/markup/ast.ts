// TODO - visitor pattern here

import * as sift from "sift";
import {
  INamed,
  IRange,
  bindable,
  TreeNode,
  patchable,
  IASTNode,
  IExpression,
  BaseExpression,
  register as registerSerializer,
} from "@tandem/common";

export enum MarkupExpressionKind {
  FRAGMENT = 1,
  ATTRIBUTE = FRAGMENT + 1,
  ELEMENT   = ATTRIBUTE + 1,
  TEXT = ELEMENT + 1,
  COMMENT   = TEXT + 1
}

export interface IMarkupExpression extends IExpression {
  readonly kind: MarkupExpressionKind;
  accept(visitor: IMarkupExpressionVisitor);
}

export interface IMarkupExpressionVisitor {
  visitElement(expression: MarkupElementExpression);
  visitComment(expression: MarkupCommentExpression);
  visitText(expression: MarkupTextExpression);
  visitAttribute(attribute: MarkupAttributeExpression);
  visitDocumentFragment(attribute: MarkupFragmentExpression);
}

export interface IMarkupValueNodeExpression extends IMarkupExpression {
  value: any;
}

export abstract class MarkupExpression extends BaseExpression implements IMarkupExpression {
  abstract readonly kind: MarkupExpressionKind;
  constructor(position: IRange) {
    super(position);
  }
  abstract accept(visitor: IMarkupExpressionVisitor);
}

export abstract class MarkupNodeExpression extends MarkupExpression {
  readonly name: string;
  constructor(name: string, position: IRange) {
    super(position);
    this.name = name;
  }
}

export abstract class MarkupContainerExpression extends MarkupNodeExpression {
  constructor(name: string, readonly childNodes: Array<MarkupExpression>, position: IRange) {
    super(name, position);
    childNodes.forEach((child) => child.parent = this);
  }
}

export class MarkupFragmentExpression extends MarkupContainerExpression implements IMarkupExpression {
  readonly kind = MarkupExpressionKind.FRAGMENT;
  constructor(children: Array<MarkupExpression>, position: IRange) {
    super("#document-fragment", children, position);
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitDocumentFragment(this);
  }
}
/**
 * Markup
 */

export class MarkupElementExpression extends MarkupContainerExpression {
  readonly kind = MarkupExpressionKind.ELEMENT;
  constructor(
    name: string,
    readonly attributes: Array<MarkupAttributeExpression>,
    childNodes: Array<MarkupExpression>,
    position: IRange) {
    super(name, childNodes, position);
    attributes.forEach((attribute) => attribute.parent = this);
  }
  getAttributeValue(name: string) {
    for (const attribute of this.attributes) {
      if (attribute.name === name) return attribute.value;
    }
  }
  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitElement(this);
  }
}

export class MarkupAttributeExpression extends MarkupExpression {
  readonly kind = MarkupExpressionKind.ATTRIBUTE;
  constructor(readonly name: string, readonly value: any, position: IRange) {
    super(position);
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitAttribute(this);
  }
}

export class MarkupTextExpression extends MarkupNodeExpression implements IMarkupValueNodeExpression {
  readonly kind = MarkupExpressionKind.TEXT;
  constructor(readonly value: string, position: IRange) {
    super("#text", position);
    this.value = value;
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitText(this);
  }
}

export class MarkupCommentExpression extends MarkupNodeExpression implements IMarkupValueNodeExpression {
  readonly kind = MarkupExpressionKind.COMMENT;

  constructor(readonly value: string, position: IRange) {
    super("#comment", position);
    this.value = value;
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitComment(this);
  }
}

