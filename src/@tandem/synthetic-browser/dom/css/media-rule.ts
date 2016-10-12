import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSStyleRule } from "./style-rule";

export class SyntheticCSSMediaRule {
  public expression: any;
  public cssRules: SyntheticCSSStyleRule[];

  constructor(public media: string[]) {
    this.cssRules = [];
  }

  get cssText() {
    return `@media ${this.media.join(" ")} {
      ${this.cssRules.map((rule) => rule.cssText).join("\n")}
    }`;
  }
}