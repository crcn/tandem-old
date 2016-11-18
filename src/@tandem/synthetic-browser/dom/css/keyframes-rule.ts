import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import { BaseContentEdit, EditChange, SetKeyValueEditChange } from "@tandem/sandbox";
import {
  ISerializer,
  deserialize,
  serializable,
  serialize,
  diffArray,
  ISerializedContent,
  ITreeWalker
} from "@tandem/common";
import { SyntheticCSSAtRule, SyntheticCSSAtRuleEdit } from "./atrule";

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
    return new SyntheticCSSKeyframesRule(name, cssRules.map((cs) => deserialize(cs, injector)));
  }
}

export class SyntheticCSSKeyframesRuleEdit extends SyntheticCSSAtRuleEdit<SyntheticCSSKeyframesRule> {
  static readonly SET_KEYFRAME_NAME_EDIT = "setKeyFrameNameEdit";
  setName(value: string) {
    this.addChange(new SetKeyValueEditChange(SyntheticCSSKeyframesRuleEdit.SET_NAME_EDIT, this.target, "name", value));
  }
  addDiff(newAtRule: SyntheticCSSKeyframesRule) {
    if (this.target.name !== newAtRule.name) {
      this.setName(newAtRule.name);
    }
    return super.addDiff(newAtRule);
  }
}

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSKeyframesRuleSerializer()))
export class SyntheticCSSKeyframesRule extends SyntheticCSSAtRule {
  readonly atRuleName: string = "keyframes";

  constructor(public name: string, rules: SyntheticCSSStyleRule[]) {
    super(rules);
  }

  get params() {
    return this.name;
  }

  get cssText() {
    return `@keyframes ${this.name} {
      ${this.innerText}
    }`
  }

  cloneShallow(deep?: boolean) {
    return new SyntheticCSSKeyframesRule(this.name, []);
  }

  createEdit() {
    return new SyntheticCSSKeyframesRuleEdit(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.cssRules.forEach(rule => walker.accept(rule));
  }
}