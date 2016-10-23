import { Bundle } from "@tandem/sandbox";
import { CSSRuleExpression } from "./ast";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import { BaseSyntheticObjectEdit, EditAction, SetKeyValueEditAction, SetValueEditActon } from "@tandem/sandbox";
import { ISerializedSyntheticCSSStyleDeclaration, SyntheticCSSStyleDeclaration } from "./declaration";
import { Action, serializable, serialize, deserialize, ISerializer, ISerializedContent, diffArray, ITreeWalker } from "@tandem/common";

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

// TODO - move this to synthetic-browser
export class SyntheticCSSStyleRuleEdit extends BaseSyntheticObjectEdit<SyntheticCSSStyleRule> {

  static readonly SET_DECLARATION = "setDeclaration";
  static readonly SET_RULE_SELECTOR = "setRuleSelector";

  setSelector(selector: string) {
    return this.addAction(new SetValueEditActon(SyntheticCSSStyleRuleEdit.SET_DECLARATION, this.target, selector));
  }

  setDeclaration(name: string, value: string, newName?: string) {
    return this.addAction(new SetKeyValueEditAction(SyntheticCSSStyleRuleEdit.SET_DECLARATION, this.target, name, value, newName));
  }

  addDiff(newRule: SyntheticCSSStyleRule) {

    if (this.target.selector !== newRule.selector) {
      this.setSelector(newRule.selector);
    }

    this.addChildEdit(this.target.style.createEdit().fromDiff(newRule.style));

    return this;
  }
}

export function diffSyntheticCSSStyleRules(oldRules: SyntheticCSSStyleRule[], newRules: SyntheticCSSStyleRule[]) {
  return diffArray(oldRules, newRules, (oldRule, newRule) => {
    return oldRule.selector === newRule.selector ? 0 : -1;
  });
}

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSStyleRuleSerializer()))
export class SyntheticCSSStyleRule extends SyntheticCSSObject {

  constructor(public selector: string, public style: SyntheticCSSStyleDeclaration) {
    super();
  }

  createEdit() {
    return new SyntheticCSSStyleRuleEdit(this);
  }

  get cssText() {
    return `${this.selector} {
      ${this.style.cssText}
    }`;
  }

  clone(deep?: boolean) {
    const clone = new SyntheticCSSStyleRule(this.selector, undefined);
    if (deep) clone.style = this.style.clone(deep);
    return this.linkClone(clone);
  }

  visitWalker(walker: ITreeWalker) {
    walker.accept(this.style);
  }
}