import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit } from "./base";
import {
  ISerializer,
  serialize,
  deserialize,
  serializable,
  ISerializedContent,
  ITreeWalker,
  ChildMutation,
  Mutation,
  MoveChildMutation,
  ApplicableMutation,
  PropertyMutation,
  InsertChildMutation,
  RemoveChildMutation,
} from "@tandem/common";

import { BaseContentEdit } from "@tandem/sandbox";

import { SyntheticCSSAtRule, SyntheticCSSAtRuleEdit } from "./atrule";

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
  deserialize({ media, cssRules }: ISerializedSyntheticCSSMediaRule, injector) {
    return new SyntheticCSSMediaRule(media, cssRules.map((cs) => deserialize(cs, injector)));
  }
}

export namespace SyntheticCSSMediaRuleMutationTypes {
  export const SET_MEDIA_EDIT = "setMediaEdit";
}

export class SyntheticCSSMediaRuleEdit extends SyntheticCSSAtRuleEdit<SyntheticCSSMediaRule> {


  setMedia(value: string[]) {
    return this.addChange(new PropertyMutation(SyntheticCSSMediaRuleMutationTypes.SET_MEDIA_EDIT, this.target, "media", value));
  }

  addDiff(newMediaRule: SyntheticCSSMediaRule) {

    if (this.target.media.join("") !== newMediaRule.media.join("")) {
      this.setMedia(newMediaRule.media);
    }

    return super.addDiff(newMediaRule);
  }
}

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSMediaRuleSerializer()))
export class SyntheticCSSMediaRule extends SyntheticCSSAtRule {
  readonly atRuleName = "media";

  constructor(public media: string[], rules: SyntheticCSSStyleRule[]) {
    super(rules);
  }

  get cssText() {
    return `@media ${this.media.join(" ")} {\n${this.innerText}}\n`
  }

  get params() {
    return this.media.join(" ");
  }

  cloneShallow() {
    return new SyntheticCSSMediaRule(this.media.concat(), []);
  }

  getEditChangeTargets() {
    return Object.assign({
      [SyntheticCSSMediaRuleMutationTypes.SET_MEDIA_EDIT]: this as SyntheticCSSAtRule,
    }, super.getEditChangeTargets());
  }

  createEdit() {
    return new SyntheticCSSMediaRuleEdit(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.cssRules.forEach(rule => walker.accept(rule));
  }
}