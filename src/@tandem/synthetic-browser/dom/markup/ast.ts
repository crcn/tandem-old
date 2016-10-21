import * as sift from "sift";

import {
  INamed,
  IRange,
  bindable,
  TreeNode,
  patchable,
  cloneRange,
  IExpression,
  BaseExpression,
  ISourceLocation,
  cloneSourceLocation,
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

export function serializeMarkupExpression(expression: MarkupExpression): Object {
  return expression.accept({
    visitAttribute({ kind, name, value, location }) {
      return { kind, name, value, location };
    },
    visitComment({ kind, nodeValue, location  }) {
      return { kind, nodeValue, location  };
    },
    visitDocumentFragment({ kind, childNodes, location  }) {
      return { kind, location, childNodes: childNodes.map(child => child.accept(this))}
    },
    visitText({ kind, nodeValue, location  }) {
      return { kind, nodeValue, location  };
    },
    visitElement({ kind, attributes, childNodes, location  }) {
      return { kind, location, attribute: attributes.map(attribute => attribute.accept(this)), childNodes: childNodes.map(child => child.accept(this)) };
    }
  })
}

export function deserializeMarkupExpression(data: any): MarkupExpression {
  switch(data.kind) {
    case MarkupExpressionKind.ATTRIBUTE: return new MarkupAttributeExpression(data.name, data.value, data.location);
    case MarkupExpressionKind.COMMENT: return new MarkupCommentExpression(data.nodeValue, data.location);
    case MarkupExpressionKind.TEXT: return new MarkupTextExpression(data.nodeValue, data.location);
    case MarkupExpressionKind.FRAGMENT: return new MarkupFragmentExpression(data.childNodes.map(deserializeMarkupExpression), data.location);
    case MarkupExpressionKind.ELEMENT: return new MarkupElementExpression(data.nodeName, data.attributes.map(deserializeMarkupExpression), data.childNodes.map(deserializeMarkupExpression), data.location);
  }
}

export interface IMarkupValueNodeExpression extends IMarkupExpression {
  nodeValue: any;
}

export abstract class MarkupExpression extends BaseExpression implements IMarkupExpression {
  abstract readonly kind: MarkupExpressionKind;
  constructor(location: ISourceLocation) {
    super(location);
  }
  abstract accept(visitor: IMarkupExpressionVisitor);
  abstract clone();
}

export abstract class MarkupNodeExpression extends MarkupExpression {
  public parent: MarkupContainerExpression;
  constructor(public nodeName: string, location: ISourceLocation) {
    super(location);
  }
  abstract clone();
}

export abstract class MarkupContainerExpression extends MarkupNodeExpression {
  constructor(name: string, readonly childNodes: Array<MarkupNodeExpression>, location: ISourceLocation) {
    super(name, location);
    childNodes.forEach((child) => child.parent = this);
  }
  removeChild(child: MarkupNodeExpression) {
    const i = this.childNodes.indexOf(child);
    if (i !== -1) {
      child.parent = undefined;
      this.childNodes.splice(i, 1);
    }
  }
  appendChild(child: MarkupNodeExpression) {
    this.childNodes.push(child);
  }

  insertBefore(child: MarkupNodeExpression, referenceNode: MarkupNodeExpression) {
    const index = this.childNodes.indexOf(referenceNode);
    this.childNodes.splice(index, 0, child);
  }

  replaceChild(newChild: MarkupNodeExpression, oldChild: MarkupNodeExpression) {
    const index = this.childNodes.indexOf(oldChild);
    this.childNodes.splice(index, 1, newChild);
  }
}

export class MarkupFragmentExpression extends MarkupContainerExpression implements IMarkupExpression {
  readonly kind = MarkupExpressionKind.FRAGMENT;
  constructor(childNodes: Array<MarkupNodeExpression>, location: ISourceLocation) {
    super("#document-fragment", childNodes, location);
  }

  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitDocumentFragment(this);
  }
  clone() {
    return new MarkupFragmentExpression(
      this.childNodes.map((child) => child.clone()),
      cloneSourceLocation(this.location)
    );
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
    location: ISourceLocation) {
    super(name, childNodes, location);
    attributes.forEach((attribute) => attribute.parent = this);
  }
  getAttribute(name: string) {
    for (const attribute of this.attributes) {
      if (attribute.name === name) return attribute.value;
    }
  }
  setAttribute(name: string, value: string) {
    for (const attribute of this.attributes) {
      if (attribute.name === name) {
        attribute.value = value;
        return;
      }
    }
    this.attributes.push(new MarkupAttributeExpression(name, value, null));
  }
  removeAttribute(name: string) {
    for (let i = 0, n = this.attributes.length; i < n; i++) {
      const attribute = this.attributes[i];
      if (attribute.name === name) {
        this.attributes.splice(i, 1);
        return;
      }
    }
  }
  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitElement(this);
  }
  clone() {
    return new MarkupElementExpression(
      this.nodeName,
      this.attributes.map((child) => child.clone()),
      this.childNodes.map((child) => child.clone()),
      cloneSourceLocation(this.location)
    );
  }
}

export class MarkupAttributeExpression extends MarkupExpression {
  readonly kind = MarkupExpressionKind.ATTRIBUTE;
  public parent: MarkupElementExpression;
  constructor(readonly name: string, public value: any, location: ISourceLocation) {
    super(location);
  }
  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitAttribute(this);
  }
  clone() {
    return new MarkupAttributeExpression(this.name, this.value, cloneSourceLocation(this.location));
  }
}

export class MarkupTextExpression extends MarkupNodeExpression implements IMarkupValueNodeExpression {
  readonly kind = MarkupExpressionKind.TEXT;
  constructor(public nodeValue: string, location: ISourceLocation) {
    super("#text", location);
  }
  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitText(this);
  }
  clone() {
    return new MarkupTextExpression(this.nodeValue, cloneSourceLocation(this.location));
  }
}

export class MarkupCommentExpression extends MarkupNodeExpression implements IMarkupValueNodeExpression {
  readonly kind = MarkupExpressionKind.COMMENT;
  constructor(public nodeValue: string, location: ISourceLocation) {
    super("#comment", location);
  }
  accept(visitor: IMarkupExpressionVisitor) {
    return visitor.visitComment(this);
  }
  clone() {
    return new MarkupCommentExpression(this.nodeValue, cloneSourceLocation(this.location));
  }
}

