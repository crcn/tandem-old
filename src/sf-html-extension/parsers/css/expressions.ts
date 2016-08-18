import { IRange } from "sf-core/geom";
import { BaseExpression, flattenEach } from "../core/expression";

export class CSSExpression extends BaseExpression { }

export const CSS_STYLE = "cssStyle";
export class CSSStyleExpression extends CSSExpression {
  private _declarationsByKey: any;
  private _values: any;

  constructor(public declarations: Array<CSSStyleDeclarationExpression>, public position: IRange) {
    super(CSS_STYLE, position);
    this._declarationsByKey = {};
    this._values = {};

    for (const declaration of declarations) {
      this._declarationsByKey[declaration.key] = declaration;
      this._values[declaration.key] = declaration.value.toString();
    }
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

  // patch(expression: CSSStyleExpression) {
  //   this.position = expression.position;
  //   for (const newDeclaration of expression.declarations) {
  //     for (const existingDeclaration of this.declarations) {
  //       if (newDeclaration.key === existingDeclaration.key) {
  //         existingDeclaration.pat
  //       }
  //     }
  //   }
  // }

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

  patch(expression: CSSExpression) {

  }

  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.value._flattenDeep(items);
  }
  toString() {
    if (this.key === "" || this.value.toString() === "") return "";
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
  toString() {
    return `${this.selector} { ${this.style} }`;
  }
}

export const CSS_STYLE_SHEET = "cssStyleSheet";
export class CSSStyleSheetExpression extends CSSExpression {
  constructor(public rules: Array<CSSRuleExpression>, position: IRange) {
    super(CSS_STYLE_SHEET, position);
  }
  toString() {
    return this.rules.join(" ");
  }
}