import * as postcss from "postcss";

import {
  IRange,
  bindable,
  patchable,
  BaseASTNode,
} from "tandem-common";

export class CSSExpression extends BaseASTNode<CSSExpression> {
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
    return this.children.join("\n\n");
  }
}

export class CSSRuleExpression extends CSSExpression {
  @bindable()
  @patchable
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

  protected onChildRemoved(declaration: CSSDeclarationExpression) {
    super.onChildRemoved(declaration);
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
  @patchable
  public value: string;

  constructor({ prop , value }, children: Array<CSSExpression>, position: IRange) {
    super(children, position);
    this.name = prop;
    this.value = value;
  }

  compare(expression: CSSDeclarationExpression) {
    return Number(super.compare(expression) && expression.name === this.name);
  }

  toString() {
    return [
      this.name + ": " + this.value + ";",
    ].join("");
  }
}

export class CSSATRuleExpression extends CSSExpression {

  @bindable()
  @patchable
  readonly name: string;

  @bindable()
  @patchable
  public params: string;

  constructor(protected _node: postcss.AtRule, children: Array<CSSExpression>, position: IRange) {
    super(children, position);
    this.name = _node.name;
    this.params = _node.params;
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
  @patchable
  public value: string;

  constructor(node: postcss.Comment, children: Array<CSSExpression>, position: IRange) {
    super(children, position);
    this.value = node.text;
  }
}