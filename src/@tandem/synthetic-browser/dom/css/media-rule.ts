import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSStyleRule, diffSyntheticCSSStyleRules } from "./style-rule";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit } from "./base";
import { ISerializer, serialize, deserialize, serializable, ISerializedContent, ITreeWalker } from "@tandem/common";

import {
  EditAction,
  BaseContentEdit,
  ChildEditAction,
  MoveChildEditAction,
  ApplicableEditAction,
  SetKeyValueEditAction,
  InsertChildEditAction,
  RemoveChildEditAction,
} from "@tandem/sandbox";
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

export class SyntheticCSSMediaRuleEdit extends SyntheticCSSAtRuleEdit<SyntheticCSSMediaRule> {

  static readonly SET_MEDIA_EDIT       = "setMediaEdit";

  setMedia(value: string[]) {
    return this.addAction(new SetKeyValueEditAction(SyntheticCSSMediaRuleEdit.SET_MEDIA_EDIT, this.target, "media", value));
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

  constructor(public media: string[], rules: SyntheticCSSStyleRule[]) {
    super(rules);
  }

  get cssText() {
    return `@media ${this.media.join(" ")} {
      ${this.innerText}
    }`
  }

  get name() {
    return this.media.join(" ");
  }

  cloneShallow() {
    return new SyntheticCSSMediaRule(this.media.concat(), []);
  }

  countShallowDiffs(target: SyntheticCSSMediaRule) {
    return this.media.join("") === target.media.join("") ? 0 : -1;
  }

  getEditActionTargets() {
    return Object.assign({
      [SyntheticCSSMediaRuleEdit.SET_MEDIA_EDIT]: this as SyntheticCSSAtRule,
    }, super.getEditActionTargets());
  }

  createEdit() {
    return new SyntheticCSSMediaRuleEdit(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.cssRules.forEach(rule => walker.accept(rule));
  }
}