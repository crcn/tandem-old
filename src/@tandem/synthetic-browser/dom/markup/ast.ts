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
  nodeValue: any;
}

export abstract class MarkupExpression extends BaseExpression implements IMarkupExpression {
  abstract readonly kind: MarkupExpressionKind;
  constructor(position: IRange) {
    super(position);
  }
  abstract accept(visitor: IMarkupExpressionVisitor);
}

export abstract class MarkupNodeExpression extends MarkupExpression {
  public parent: MarkupContainerExpression;
  constructor(public nodeName: string, position: IRange) {
    super(position);
  }
}

export abstract class MarkupContainerExpression extends MarkupNodeExpression {
  constructor(name: string, readonly childNodes: Array<MarkupNodeExpression>, position: IRange) {
    super(name, position);
    childNodes.forEach((child) => child.parent = this);
  }
  removeChild(child: MarkupNodeExpression) {
    const i = this.childNodes.indexOf(child);
    if (i !== -1) {
      child.parent = undefined;
      this.childNodes.splice(i, 1);
    }
  }
}

export class MarkupFragmentExpression extends MarkupContainerExpression implements IMarkupExpression {
  readonly kind = MarkupExpressionKind.FRAGMENT;
  constructor(childNodes: Array<MarkupNodeExpression>, position: IRange) {
    super("#document-fragment", childNodes, position);
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
    childNodes: Array<MarkupNodeExpression>,
    position: IRange) {
    super(name, childNodes, position);
    attributes.forEach((attribute) => attribute.parent = this);
  }
  getAttributeValue(name: string) {
    for (const attribute of this.attributes) {
      if (attribute.name === name) return attribute.value;
    }
  }
  appendChild(child: MarkupNodeExpression) {
    this.childNodes.push(child);
  }
  setAttributeValue(name: string, value: string) {
    for (const attribute of this.attributes) {
      if (attribute.name === name) {
        attribute.value = value;
        return;
      }
    }
    this.attributes.push(new MarkupAttributeExpression(name, value, null));
  }
  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitElement(this);
  }
}

export class MarkupAttributeExpression extends MarkupExpression {
  readonly kind = MarkupExpressionKind.ATTRIBUTE;
  constructor(readonly name: string, public value: any, position: IRange) {
    super(position);
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitAttribute(this);
  }
}

export class MarkupTextExpression extends MarkupNodeExpression implements IMarkupValueNodeExpression {
  readonly kind = MarkupExpressionKind.TEXT;
  constructor(public nodeValue: string, position: IRange) {
    super("#text", position);
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitText(this);
  }
}

export class MarkupCommentExpression extends MarkupNodeExpression implements IMarkupValueNodeExpression {
  readonly kind = MarkupExpressionKind.COMMENT;

  constructor(public nodeValue: string, position: IRange) {
    super("#comment", position);
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitComment(this);
  }
}

