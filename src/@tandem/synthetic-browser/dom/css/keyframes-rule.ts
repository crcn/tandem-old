import { BaseContentEdit } from "@tandem/sandbox";
import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import { ISerializer, deserialize, serializable, serialize, ISerializedContent, ITreeWalker } from "@tandem/common";

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

export class AtRuleEdit extends BaseContentEdit<SyntheticCSSKeyframesRule> {
  addDiff(newAtRule: SyntheticCSSKeyframesRule) {
    return this;
  }
}

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSKeyframesRuleSerializer()))
export class SyntheticCSSKeyframesRule extends SyntheticCSSObject {
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

  clone(deep?: boolean) {
    const clone = new SyntheticCSSKeyframesRule(this.name);
    if (deep) {
      for (let i = 0, n = this.cssRules.length; i < n; i++) {
        clone.cssRules.push(this.cssRules[i].clone(deep));
      }
    }
    return this.linkClone(clone);
  }

  createEdit() {
    return new AtRuleEdit(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.cssRules.forEach(rule => walker.accept(rule));
  }
}