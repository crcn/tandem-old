import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSStyleRule } from "./style-rule";

export class SyntheticCSSFontFace {
  public expression: any;
  public declaration: SyntheticCSSStyleDeclaration;

  constructor() {

  }

  get cssText() {
    return `@font-face {
      ${this.declaration.cssText}
    }`;
  }
}