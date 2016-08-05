import { BaseExpression, ICursorPosition, flattenEach } from "../core/expression";

export class CSSExpression extends BaseExpression { }

export const CSS_STYLE = "cssStyle";
export class CSSStyleExpression extends CSSExpression {
  constructor(public declarations: Array<CSSStyleDeclarationExpression>, public position: ICursorPosition) {
    super(CSS_STYLE, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    flattenEach(this.declarations, items);
  }
  toString() {
    return this.declarations.join("");
  };
}

export const CSS_STYLE_DECLARATION = "cssStyleDeclaration";
export class CSSStyleDeclarationExpression extends CSSExpression {
  constructor(public key: string, public value: CSSExpression, public position: ICursorPosition) {
    super(CSS_STYLE_DECLARATION, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.value._flattenDeep(items);
  }
  toString() {
    return [this.key, ":", this.value.toString(), ";"].join("");
  }
}

export const CSS_LITERAL_VALUE = "cssLiteralValue";
export class CSSLiteralExpression extends CSSExpression {
  constructor(public value: string, public position: ICursorPosition) {
    super(CSS_LITERAL_VALUE, position);
  }
  toString() {
    return this.value;
  }
}

export const CSS_FUNCTION_CALL = "cssFunctionCall";
export class CSSFunctionCallExpression extends CSSExpression {
  constructor(public name: string, public parameters: Array<CSSExpression>, public position: ICursorPosition) {
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
  constructor(public values: Array<CSSExpression>, public position: ICursorPosition) {
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