import { SyntheticCSSStyleDeclaration } from "./declaration";

export class SyntheticCSSStyleRule {
  constructor(public selector: string, public style: SyntheticCSSStyleDeclaration) {

  }

  get cssText() {
    return `${this.selector} {
      ${this.style.cssText}
    }`;
  }
}