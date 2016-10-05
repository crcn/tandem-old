import * as postcss from "postcss";

import {
  IRange,
  bindable,
  patchable,
  BaseASTNode,
} from "@tandem/common";

export interface ICSSExpressionVisitor {
  visitRoot(root: CSSStyleSheetExpression);
  visitRule(rule: CSSRuleExpression);
  visitDeclaration(declaration: CSSDeclarationExpression);
  visitAtRule(atRule: CSSATRuleExpression);
  visitComment(comment: CSSCommentExpression);
}

export abstract class CSSExpression extends BaseASTNode<CSSExpression> {
  constructor(position: IRange) {
    super(position);
    this.initialize();
  }

  abstract accept(visitor: ICSSExpressionVisitor);

  protected initialize() { }
}

export class CSSStyleSheetExpression extends CSSExpression {
  readonly rules: CSSRuleExpression[];
  constructor(private _node: postcss.Root, children: CSSExpression[], position: IRange) {
    super(position);
    this.rules = children as any;
  }

  accept(visitor: ICSSExpressionVisitor) {
    return visitor.visitRoot(this);
  }

  toString() {
    return this.children.join("\n\n");
  }
}

export class CSSRuleExpression extends CSSExpression {
  @bindable()
  @patchable()
  readonly selector: string;
  private _declarationsByKey: Object;
  constructor(private _node: postcss.Rule, readonly declarations: CSSDeclarationExpression[], position: IRange) {
    super(position);
    this.selector = _node.selector;
  }

  protected initialize() {
    this._declarationsByKey = {};
  }

  accept(visitor: ICSSExpressionVisitor) {
    return visitor.visitRule(this);
  }

  public removeDeclaration(key: string) {
    if (this._declarationsByKey[key]) {
      this.removeChild(this._declarationsByKey[key]);
    }
  }

  toString() {
    return [
      this.selector,
      " {",
      this.children.join(""),
      "}",
    ].join("");
  }
}

export class CSSDeclarationExpression extends CSSExpression {

  @bindable()
  public name: string;

  @bindable()
  @patchable()
  public value: string;

  constructor({ prop , value }, position: IRange) {
    super(position);
    this.name = prop;
    this.value = value;
  }

  compare(expression: CSSDeclarationExpression) {
    return Number(super.compare(expression) && expression.name === this.name);
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

  @bindable()
  @patchable()
  readonly name: string;

  @bindable()
  @patchable()
  public params: string;

  constructor(protected _node: postcss.AtRule, children: Array<CSSExpression>, position: IRange) {
    super(position);
    this.name = _node.name;
    this.params = _node.params;
  }

  accept(visitor: ICSSExpressionVisitor) {
    return visitor.visitAtRule(this);
  }

  toString() {

    const buffer = [
      "@" + this.name + " ",
      this.params
    ];

    if (this.children.length) {
      buffer.push(" {",
      this.children.join(" "),
      "}");
    } else {
      buffer.push(";");
    }

    return buffer.join("");
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

  @bindable()
  @patchable()
  public value: string;

  constructor(node: postcss.Comment, position: IRange) {
    super(position);
    this.value = node.text;
  }

  accept(visitor: ICSSExpressionVisitor) {
    return visitor.visitComment(this);
  }
}