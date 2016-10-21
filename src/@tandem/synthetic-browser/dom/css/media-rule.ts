import { SyntheticCSSObject } from "./base";
import { CSSATRuleExpression } from "./ast";
import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { ISerializer, serialize, deserialize, serializable, ISerializedContent } from "@tandem/common";

export interface ISerializedSyntheticCSSMediaRule {
  media: string[];
  cssRules: Array<ISerializedContent<any>>;
}

class SyntheticCSSMediaRuleSerializer implements ISerializer<SyntheticCSSMediaRule, ISerializedSyntheticCSSMediaRule> {
  serialize({ media, cssRules }: SyntheticCSSMediaRule) {
    return {
      media: media,
      cssRules: cssRules.map(serialize)
    };
  }
  deserialize({ media, cssRules }: ISerializedSyntheticCSSMediaRule, dependencies) {
    const rule = new SyntheticCSSMediaRule(media);
    cssRules.forEach((cs) => rule.cssRules.push(deserialize(cs, dependencies)));
    return rule;
  }
}

@serializable(new SyntheticCSSMediaRuleSerializer())
export class SyntheticCSSMediaRule extends SyntheticCSSObject<CSSATRuleExpression> {
  public cssRules: SyntheticCSSStyleRule[];

  constructor(public media: string[]) {
    super();
    this.cssRules = [];
  }

  get cssText() {
    return `@media ${this.media.join(" ")} {
      ${this.cssRules.map((rule) => rule.cssText).join("\n")}
    }`;
  }
}