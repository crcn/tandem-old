import { IRange } from "sf-core/geom";
import { diffArray, patchArray } from "sf-core/utils/array";
import { BaseExpression, flattenEach } from "../core/expression";

export class CSSExpression extends BaseExpression { }

export const CSS_STYLE = "cssStyle";
export class CSSStyleExpression extends CSSExpression {
  private _declarationsByKey: any;
  private _values: any;

  constructor(public declarations: Array<CSSStyleDeclarationExpression>, public position: IRange) {
    super(CSS_STYLE, position);
    this._reset();
  }

  private _reset() {
    this._declarationsByKey = {};
    this._values = {};

    for (const declaration of this.declarations) {
      this._declarationsByKey[declaration.key] = declaration;
      this._values[declaration.key] = declaration.value.toString();
    }
  }

  static merge(a: CSSStyleExpression, b: CSSStyleExpression): CSSStyleExpression {
    a.position = b.position;
    patchArray(a.declarations, diffArray(a.declarations, b.declarations, (a, b) => a .key === b.key), CSSStyleDeclarationExpression.merge);
    a._reset();
    return a;
  }

  public _flattenDeep(items) {
    super._flattenDeep(items);
    flattenEach(this.declarations, items);
  }

  public updateDeclarations(style: Object) {
    for (let key in style) {
      const value = style[key];

      let declaration: CSSStyleDeclarationExpression;
      if ((declaration = this._declarationsByKey[key])) {
        declaration.value = value;
      } else {
        this.declarations.push(this._declarationsByKey[key] = new CSSStyleDeclarationExpression(key, value, null));
      }
      this._values[key] = value;
    }
  }

  get values() {
    return this._values;
  }

  public removeDeclaration(key: string) {
    for (let i = this.declarations.length; i--; ) {
      if (this.declarations[i].key === key) {
        this.declarations.splice(i, 1);
        break;
      }
    }
  }

  toString() {
    return this.declarations.join("");
  };
}

export const CSS_STYLE_DECLARATION = "cssStyleDeclaration";
export class CSSStyleDeclarationExpression extends CSSExpression {
  constructor(public key: string, public value: CSSExpression, public position: IRange) {
    super(CSS_STYLE_DECLARATION, position);
  }

  static merge(a: CSSStyleDeclarationExpression, b: CSSStyleDeclarationExpression): CSSStyleDeclarationExpression {
    a.position = b.position;
    a.key = b.key;
    if (a.value.constructor === b.value.constructor && (<any>a.value.constructor).merge) {
      (<any>a.value.constructor).merge(a.value, b.value);
    } else {
      a.value = b.value;
    }

    return a;
  }

  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.value._flattenDeep(items);
  }
  toString() {
    if (this.key === "") return "";
    return [this.key, ":", this.value.toString(), ";"].join("");
  }
}

export const CSS_LITERAL_VALUE = "cssLiteralValue";
export class CSSLiteralExpression extends CSSExpression {
  constructor(public value: string, public position: IRange) {
    super(CSS_LITERAL_VALUE, position);
  }
  toString() {
    return this.value;
  }
}

export const CSS_FUNCTION_CALL = "cssFunctionCall";
export class CSSFunctionCallExpression extends CSSExpression {
  constructor(public name: string, public parameters: Array<CSSExpression>, public position: IRange) {
    super(CSS_FUNCTION_CALL, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    flattenEach(this.parameters, items);
  }
  toString() {
    return [this.name, "(", this.parameters.join(","), ")"].join("");
  }
}

export const CSS_LIST_VALUE = "cssListValue";
export class CSSListValueExpression extends CSSExpression {
  constructor(public values: Array<CSSExpression>, public position: IRange) {
    super(CSS_LIST_VALUE, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    flattenEach(this.values, items);
  }
  toString() {
    return this.values.join(" ");
  }
}

export const CSS_RULE = "cssRule";

export class CSSRuleExpression extends CSSExpression {
  constructor(public selector: string, public style: CSSStyleExpression, position: IRange) {
    super(CSS_RULE, position);
  }
  static merge(a: CSSRuleExpression, b: CSSRuleExpression) {
    a.position = b.position;
    a.selector = b.selector;
    CSSStyleExpression.merge(a.style, b.style);
  }
  toString() {
    return `${this.selector} { ${this.style} }`;
  }
}

export const CSS_STYLE_SHEET = "cssStyleSheet";
export class CSSStyleSheetExpression extends CSSExpression {

  constructor(public rules: Array<CSSRuleExpression>, position: IRange) {
    super(CSS_STYLE_SHEET, position);
  }

  static merge(a: CSSStyleSheetExpression, b: CSSStyleSheetExpression) {
    a.position = b.position;
    patchArray(a.rules, diffArray<CSSRuleExpression>(a.rules, b.rules, (a, b) => a.selector === b.selector), (a, b) => {
      CSSRuleExpression.merge(a, b);
      return a;
    });
  }

  toString() {
    return this.rules.join(" ");
  }
}