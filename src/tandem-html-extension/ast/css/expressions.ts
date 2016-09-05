import * as postcss from "postcss";

import { BaseExpression, IRange } from "tandem-common";

export class CSSExpression extends BaseExpression<CSSExpression> {
  constructor(children: Array<CSSExpression>, position: IRange) {
    super(position);
    this.initialize();
    children.forEach((child) => this.appendChild(child));
  }

  protected initialize() { }
}

export class CSSRootExpression extends CSSExpression {
  constructor(private _node: postcss.Root, children: Array<CSSExpression>, position: IRange) {
    super(children, position);
  }

  toString() {
    return this.children.join("");
  }
}

export class CSSRuleExpression extends CSSExpression {
  readonly selector: string;
  private _values: Object;
  private _declarationsByKey: Object;
  constructor(private _node: postcss.Rule, children: Array<CSSExpression>, position: IRange) {
    super(children, position);
    this.selector = _node.selector;
  }

  protected initialize() {
    this._values = {};
    this._declarationsByKey = {};
  }

  public updateDeclarations(style: Object) {
    for (let key in style) {
      const value = style[key];

      let declaration: CSSDeclarationExpression;
      if ((declaration = this._declarationsByKey[key])) {
        declaration.value = value;
      } else {
        this.appendChild(new CSSDeclarationExpression({ prop: key, value: style[key] }, [], null));
      }
      this._values[key] = value;
    }
  }

  protected onChildAdded(declaration: CSSDeclarationExpression) {
    super.onChildAdded(declaration);
    this._declarationsByKey[declaration.name] = declaration;
    this._values[declaration.value] = String(declaration.value);
  }

  protected onRemovingChild(declaration: CSSDeclarationExpression) {
    super.onRemovingChild(declaration);
    this._declarationsByKey[declaration.name] =  undefined;
    this._values[declaration.value] = undefined;
  }

  get values() {
    return this._values;
  }

  public removeDeclaration(key: string) {
    if (this._declarationsByKey[key]) {
      this.removeChild(this._declarationsByKey[key]);
    }
  }

  toString() {
    return [
      this.getWhitespaceBeforeStart(),
      this.selector,
      " {",
      this.children.join(""),
      "}",
      this.parent.lastChild === this ? this.getWhitespaceAfterEnd() : ""
    ].join("");
  }
}

export class CSSDeclarationExpression extends CSSExpression {
  public name: string;
  public value: string;
  constructor({ prop , value }, children: Array<CSSExpression>, position: IRange) {
    super(children, position);
    this.name = prop;
    this.value = value;
  }

  toString() {
    return [
      this.getWhitespaceBeforeStart(),
      this.name + ": " + this.value + ";",
      this.parent.lastChild === this ? this.getWhitespaceAfterEnd() : ""
    ].join("");
  }
}

export class ATRuleExpression extends CSSExpression {
  readonly name: string;
  public params: string;

  constructor(protected _node: postcss.AtRule, children: Array<CSSExpression>, position: IRange) {
    super(children, position);
    this.name = _node.name;
    this.params = _node.params;
  }

  toString() {
    return [
      this.getWhitespaceBeforeStart(),
      "@" + this.name + " ",
      this.params,
      " {",
      this.children.join(""),
      "}",
      this.parent.lastChild === this ? this.getWhitespaceAfterEnd() : ""
    ].join("");
  }
}

export class KeyframesExpression extends ATRuleExpression {
  constructor(node: postcss.AtRule, children: Array<CSSExpression>, position: IRange) {
    super(node, children, position);
  }
}
export class MediaExpression extends ATRuleExpression {
  constructor(node: postcss.AtRule, children: Array<CSSExpression>, position: IRange) {
    super(node, children, position);
  }
}

export class CSSCommentExpression extends CSSExpression {
  constructor(node: postcss.Comment, children: Array<CSSExpression>, position: IRange) {
    super(children, position);
  }
}