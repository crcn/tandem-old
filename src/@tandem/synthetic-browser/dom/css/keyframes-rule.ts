import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";

export class SyntheticCSSKeyframesRule {
  public cssRules: SyntheticCSSStyleRule[];
  constructor(public name: string) {
    this.cssRules = [];
  }

  get cssText() {
    return `@keyframes ${this.name} {
      ${this.cssRules.map((rule) => rule.cssText).join("\n")}
    }`;
  }
}