import { Bundle } from "@tandem/sandbox";
import { CSSRuleExpression } from "./ast";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
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

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSStyleRuleSerializer()))
export class SyntheticCSSStyleRule extends SyntheticCSSObject {

  constructor(public selector: string, public style: SyntheticCSSStyleDeclaration) {
    super();
  }

  get cssText() {
    return `${this.selector} {
      ${this.style.cssText}
    }`;
  }
}