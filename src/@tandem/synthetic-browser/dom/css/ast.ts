import * as postcss from "postcss";

import {
  IRange,
  bindable,
  patchable,
  IASTNode,
  cloneRange,
} from "@tandem/common";

export interface ICSSExpressionVisitor {
  visitRoot(root: CSSStyleSheetExpression);
  visitRule(rule: CSSRuleExpression);
  visitDeclaration(declaration: CSSDeclarationExpression);
  visitAtRule(atRule: CSSATRuleExpression);
  visitComment(comment: CSSCommentExpression);
}

export enum CSSExpressionKind {
  STYLE_SHEET  = 1,
  STYLE_RULE   = STYLE_SHEET + 1,
  AT_RULE      = STYLE_RULE + 1,
  DECLARATION  = AT_RULE + 1,
  COMMENT      = DECLARATION + 1,
}

export abstract class CSSExpression implements IASTNode {
  public parent: CSSExpression;
  abstract readonly kind: CSSExpressionKind;

  constructor(readonly position: IRange) { }

  abstract accept(visitor: ICSSExpressionVisitor);
  abstract clone();
}

export class CSSStyleSheetExpression extends CSSExpression {
  readonly kind = CSSExpressionKind.STYLE_SHEET;
  constructor(private _node: postcss.Root, readonly rules: CSSRuleExpression[], position: IRange) {
    super(position);
  }

  accept(visitor: ICSSExpressionVisitor) {
    return visitor.visitRoot(this);
  }
  toString() {
    return this.rules.join("\n");
  }
  clone() {
    return new CSSStyleSheetExpression(
      this._node,
      this.rules.map((rule) => rule.clone()),
      cloneRange(this.position)
    );
  }
}

export class CSSRuleExpression extends CSSExpression {
  readonly selector: string;
  readonly kind = CSSExpressionKind.STYLE_RULE;
  private _declarationsByKey: Object;
  constructor(private _node: postcss.Rule, readonly declarations: CSSDeclarationExpression[], position: IRange) {
    super(position);
    this.selector = _node.selector;
    declarations.forEach((child) => child.parent = this);
  }

  accept(visitor: ICSSExpressionVisitor) {
    return visitor.visitRule(this);
  }

  toString() {
    return `${this.selector} {
      ${this.declarations.join("\n")}
    }`;
  }

  clone() {
    return new CSSRuleExpression(
      this._node,
      this.declarations.map((decl) => decl.clone()),
      cloneRange(this.position)
    );
  }
}

export class CSSDeclarationExpression extends CSSExpression {

  public name: string;
  public value: string;
  readonly kind = CSSExpressionKind.DECLARATION;

  constructor({ prop , value }, position: IRange) {
    super(position);
    this.name = prop;
    this.value = value;
  }

  accept(visitor: ICSSExpressionVisitor) {
    return visitor.visitDeclaration(this);
  }

  toString() {
    return [
      this.name + ": " + this.value + ";",
    ].join("");
  }

  clone() {
    return new CSSDeclarationExpression(
      { prop: this.name, value: this.value },
      cloneRange(this.position)
    );
  }
}

export class CSSATRuleExpression extends CSSExpression {
  readonly name: string;
  public params: string;
  readonly kind = CSSExpressionKind.AT_RULE;

  constructor(protected _node: postcss.AtRule, readonly rules: Array<CSSExpression>, position: IRange) {
    super(position);
    this.name = _node.name;
    this.params = _node.params;
    rules.forEach((child) => child.parent = this);
  }

  accept(visitor: ICSSExpressionVisitor) {
    return visitor.visitAtRule(this);
  }

  toString() {
    return `@${this.name} ${this.params} {
      ${this.rules.join("\n")}
    }`;
  }

  clone() {
    return new CSSATRuleExpression(
      this._node,
      this.rules.map((rule) => rule.clone()),
      cloneRange(this.position)
    );
  }
}

export class KeyframesExpression extends CSSATRuleExpression {
  constructor(node: postcss.AtRule, children: Array<CSSExpression>, position: IRange) {
    super(node, children, position);
  }
  clone() {
    return new KeyframesExpression(
      this._node,
      this.rules.map((rule) => rule.clone()),
      cloneRange(this.position)
    );
  }
}
export class MediaExpression extends CSSATRuleExpression {
  constructor(node: postcss.AtRule, children: Array<CSSExpression>, position: IRange) {
    super(node, children, position);
  }
  clone() {
    return new MediaExpression(
      this._node,
      this.rules.map((rule) => rule.clone()),
      cloneRange(this.position)
    );
  }
}

export class CSSCommentExpression extends CSSExpression {
  public value: string;
  readonly kind = CSSExpressionKind.COMMENT;

  constructor(private _node: postcss.Comment, position: IRange) {
    super(position);
    this.value = _node.text;
  }

  toString() {
    return `/* ${this.value} */`;
  }

  accept(visitor: ICSSExpressionVisitor) {
    return visitor.visitComment(this);
  }
  clone() {
    return new CSSCommentExpression(
      this._node,
      cloneRange(this.position)
    );
  }
}