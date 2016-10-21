import { Bundle } from "@tandem/sandbox";
import { SyntheticCSSObject } from "./base";
import { CSSRuleExpression } from "./ast";
import { serializable, serialize, deserialize, ISerializer, ISerializedContent } from "@tandem/common";
import { ISerializedSyntheticCSSStyleDeclaration, SyntheticCSSStyleDeclaration } from "./declaration";

export interface ISerializedSyntheticCSSStyleRule {
  selector: string;
  style: ISerializedContent<ISerializedSyntheticCSSStyleDeclaration>
}

class SyntheticCSSStyleRuleSerializer implements ISerializer<SyntheticCSSStyleRule, ISerializedSyntheticCSSStyleRule> {
  serialize(value: SyntheticCSSStyleRule): ISerializedSyntheticCSSStyleRule {
    return {
      selector: value.selector,
      style: serialize(value.style)
    };
  }
  deserialize(value: ISerializedSyntheticCSSStyleRule, dependencies): SyntheticCSSStyleRule {
    return new SyntheticCSSStyleRule(value.selector, deserialize(value.style, dependencies));
  }
}

export const syntheticCSSStyleRuleSerializer = new SyntheticCSSStyleRuleSerializer();

@serializable(syntheticCSSStyleRuleSerializer)
export class SyntheticCSSStyleRule extends SyntheticCSSObject<CSSRuleExpression> {

  constructor(public selector: string, public style: SyntheticCSSStyleDeclaration) {
    super();
  }

  get cssText() {
    return `${this.selector} {
      ${this.style.cssText}
    }`;
  }
}