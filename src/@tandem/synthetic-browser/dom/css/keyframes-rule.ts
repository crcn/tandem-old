import { SyntheticCSSStyleRule } from "./style-rule";
import { BaseContentEdit, EditAction } from "@tandem/sandbox";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import {
  ISerializer,
  deserialize,
  serializable,
  serialize,
  ISerializedContent,
  ITreeWalker
} from "@tandem/common";

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
  deserialize({ name, cssRules }: ISerializedSyntheticCSSKeyframesRule, injector) {
    const rule = new SyntheticCSSKeyframesRule(name);
    cssRules.forEach((cs) => rule.cssRules.push(deserialize(cs, injector)));
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

  cloneShallow(deep?: boolean) {
    return new SyntheticCSSKeyframesRule(this.name);
  }

  createEdit() {
    return new AtRuleEdit(this);
  }

  applyEditAction(action: EditAction) {
    console.warn(`Cannot currently edit ${this.constructor.name}`);
  }

  visitWalker(walker: ITreeWalker) {
    this.cssRules.forEach(rule => walker.accept(rule));
  }
}