import * as postcss from "postcss";

import {
  IRange,
  bindable,
  patchable,
  IASTNode2,
  BaseASTNode,
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

export abstract class CSSExpression implements IASTNode2 {
  public parent: CSSExpression;
  abstract readonly kind: CSSExpressionKind;

  constructor(readonly position: IRange) { }

  abstract accept(visitor: ICSSExpressionVisitor);
}

export class CSSStyleSheetExpression extends CSSExpression {
  readonly kind = CSSExpressionKind.STYLE_SHEET;
  constructor(private _node: postcss.Root, readonly rules: CSSRuleExpression[], position: IRange) {
    super(position);
  }

  accept(visitor: ICSSExpressionVisitor) {
    return visitor.visitRoot(this);
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
}

export class KeyframesExpression extends CSSATRuleExpression {
  constructor(node: postcss.AtRule, children: Array<CSSExpression>, position: IRange) {
    super(node, children, position);
  }
}
export class MediaExpression extends CSSATRuleExpression {
  constructor(node: postcss.AtRule, children: Array<CSSExpression>, position: IRange) {
    super(node, children, position);
  }
}

export class CSSCommentExpression extends CSSExpression {
  public value: string;
  readonly kind = CSSExpressionKind.COMMENT;

  constructor(node: postcss.Comment, position: IRange) {
    super(position);
    this.value = node.text;
  }

  accept(visitor: ICSSExpressionVisitor) {
    return visitor.visitComment(this);
  }
}