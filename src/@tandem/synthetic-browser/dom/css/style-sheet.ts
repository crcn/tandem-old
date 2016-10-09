import { SyntheticCSSStyleRule } from "./rule";

export class SyntheticCSSStyleSheet {
  constructor(readonly rules: SyntheticCSSStyleRule[]) { }

  get cssText() {
    return this.rules.map((rule) => rule.cssText).join("\n");
  }

  toString() {
    return this.cssText;
  }
}