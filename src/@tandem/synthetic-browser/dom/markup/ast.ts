// TODO - visitor pattern here

import * as sift from "sift";
import {
  INamed,
  IRange,
  bindable,
  TreeNode,
  patchable,
  IASTNode,
  BaseASTNode,
  register as registerSerializer,
} from "@tandem/common";

export enum MarkupExpressionKind {
  FRAGMENT = 1,
  ATTRIBUTE = FRAGMENT + 1,
  ELEMENT   = ATTRIBUTE + 1,
  TEXT = ELEMENT + 1,
  COMMENT   = TEXT + 1
}

export interface IMarkupExpression extends IASTNode {
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

export abstract class MarkupExpression extends BaseASTNode<MarkupExpression> implements IMarkupExpression {
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

  compare(expression: MarkupNodeExpression): number {
    return Number(super.compare(expression) && expression.name === this.name);
  }
}

export abstract class MarkupContainerExpression extends MarkupNodeExpression {
  constructor(name: string, childNodes: Array<MarkupExpression>, position: IRange) {
    super(name, position);
    childNodes.forEach((child) => this.appendChild(child));
  }

  get firstChildNode(): MarkupNodeExpression {
    return this.childNodes[0];
  }

  get lastChildNode(): MarkupNodeExpression {
    return this.childNodes[this.childNodes.length - 1];
  }

  get childNodes(): Array<MarkupNodeExpression> {
    return <any>this.children.filter(<any>sift({ $type: MarkupNodeExpression }));
  }

  removeAllChildNodes(): void {
    for (const childNode of this.childNodes) {
      this.removeChild(childNode);
    }
  }
}

export class MarkupFragmentExpression extends MarkupContainerExpression implements IMarkupExpression {
  readonly kind = MarkupExpressionKind.FRAGMENT;
  constructor(children: Array<MarkupExpression>, position: IRange) {
    super("#document-fragment", children, position);
  }

  clone(): MarkupFragmentExpression {
    return new MarkupFragmentExpression(
      this.childNodes.map(node => node.clone()),
      this.position
    );
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitDocumentFragment(this);
  }

  public toString() {
    return this.children.join("");
  }
}
/**
 * Markup
 */

export const Markup_ELEMENT = "HTMLElement";
export class MarkupElementExpression extends MarkupContainerExpression {
  readonly kind = MarkupExpressionKind.ELEMENT;
  constructor(
    name: string,
    attributes: Array<MarkupAttributeExpression>,
    childNodes: Array<MarkupExpression>,
    position: IRange) {
    super(name, childNodes, position);
    attributes.forEach((attribute) => this.appendChild(attribute));
  }

  get attributes(): Array<MarkupAttributeExpression> {
    return <any>this.children.filter(<any>sift({ $type: MarkupAttributeExpression }));
  }

  removeAttribute(name: string) {
    const attribute = this.attributes.find((attr) => attr.name === name);
    if (attribute) {
      this.attributes.splice(this.attributes.indexOf(attribute), 1);
    }
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitElement(this);
  }

  setAttribute(name: string, value: string) {
    let found = false;
    for (const attribute of this.attributes) {
      if (attribute.name === name) {
        attribute.value = value;
        found = true;
      }
    }
    if (!found) {
      this.appendChild(new MarkupAttributeExpression(name, value, null));
    }
  }

  getAttribute(name: string) {
    for (const attribute of this.attributes) {
      if (attribute.name === name) {
        return attribute.value;
      }
    }
  }

  clone(): MarkupElementExpression {
    return new MarkupElementExpression(
      this.name,
      this.attributes.map(attribute => attribute.clone()),
      this.childNodes.map(node => node.clone()),
      this.position
    );
  }

  public toString() {

    const buffer = [];

    buffer.push("<", this.name);

    for (const attribute of this.attributes) {
      buffer.push(" ", attribute.toString());
    }

    if (this.children.length) {
      buffer.push(">");
      for (const child of this.childNodes) {
        buffer.push(child.toString());
      }
      buffer.push("</", this.name, ">");
    } else {
      buffer.push(" />");
    }

    // necessary to add a newline character at the end of a source in case new
    // expressions are added at the end
    // if (isEOF(this.position, this.source) && /^\n/.test(endWhitespace)) {
    //   buffer.push("\n");
    // }

    return buffer.join("");
  }
}

export class MarkupAttributeExpression extends MarkupExpression implements IASTNode {
  readonly kind = MarkupExpressionKind.ATTRIBUTE;

  @bindable()
  @patchable()
  public value: any;

  @bindable()
  @patchable()
  public name: string;

  constructor(name: string, value: any, position: IRange) {
    super(position);
    this.name = name;
    this.value = value;
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitAttribute(this);
  }

  compare(expression: MarkupAttributeExpression) {
    return Number(super.compare(expression) && this.name === expression.name);
  }

  clone(): MarkupAttributeExpression {
    return new MarkupAttributeExpression(
      this.name,
      this.value,
      this.position
    );
  }

  toString() {
    const buffer = [this.name];
    const value = this.value;
    if (value !== "\"\"") {
      buffer.push("=", typeof value === "object" ? value : "\"" + value + "\"");
    }
    return buffer.join("");
  }
}

export class MarkupTextExpression extends MarkupNodeExpression implements IMarkupValueNodeExpression {
  readonly kind = MarkupExpressionKind.TEXT;

  @bindable()
  @patchable()
  public value: string;

  constructor(value: string, position: IRange) {
    super("#text", position);
    this.value = value;
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitText(this);
  }

  clone(): MarkupTextExpression {
    return new MarkupTextExpression(
      this.value,
      this.position
    );
  }

  toString() {
    return this.value.trim();
  }
}

export class MarkupCommentExpression extends MarkupNodeExpression implements IMarkupValueNodeExpression {
  readonly kind = MarkupExpressionKind.COMMENT;

  @bindable()
  @patchable()
  public value: string;

  constructor(value: string, position: IRange) {
    super("#comment", position);
    this.value = value;
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitComment(this);
  }

  clone(): MarkupCommentExpression {
    return new MarkupCommentExpression(
      this.value,
      this.position
    );
  }

  toString() {
    return [
      "<!--", this.value, "-->"
    ].join("");
  }
}

