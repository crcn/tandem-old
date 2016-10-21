import { SyntheticCSSObject } from "./base";
import { CSSATRuleExpression } from "./ast";
import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { ISerializer, deserialize, serializable, serialize, ISerializedContent } from "@tandem/common";

export interface ISerializedSyntheticCSSKeyframesRule {
  name: string;
  cssRules: Array<ISerializedContent<any>>;
}

class SyntheticCSSKeyframesRuleSerializer implements ISerializer<SyntheticCSSKeyframesRule, ISerializedSyntheticCSSKeyframesRule> {
  serialize({ name, cssRules }: SyntheticCSSKeyframesRule) {
    return {
      name: name,
      cssRules: cssRules.map(serialize)
    };
  }
  deserialize({ name, cssRules }: ISerializedSyntheticCSSKeyframesRule, dependencies) {
    const rule = new SyntheticCSSKeyframesRule(name);
    cssRules.forEach((cs) => rule.cssRules.push(deserialize(cs, dependencies)));
    return rule;
  }
}

@serializable(new SyntheticCSSKeyframesRuleSerializer())
export class SyntheticCSSKeyframesRule extends SyntheticCSSObject<CSSATRuleExpression> {
  public cssRules: SyntheticCSSStyleRule[];
  constructor(public name: string) {
    super();
    this.cssRules = [];
  }

  get cssText() {
    return `@keyframes ${this.name} {
      ${this.cssRules.map((rule) => rule.cssText).join("\n")}
    }`;
  }
}