import { Bundle } from "@tandem/sandbox";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import { BaseContentEdit, EditAction, SetKeyValueEditAction, SetValueEditActon } from "@tandem/sandbox";
import { ISerializedSyntheticCSSStyleDeclaration, SyntheticCSSStyleDeclaration } from "./declaration";
import { Action, serializable, serialize, deserialize, ISerializer, ISerializedContent, diffArray, ITreeWalker, ArrayDiff } from "@tandem/common";

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
  deserialize(value: ISerializedSyntheticCSSStyleRule, injector): SyntheticCSSStyleRule {
    return new SyntheticCSSStyleRule(value.selector, deserialize(value.style, injector));
  }
}

// TODO - move this to synthetic-browser
export class SyntheticCSSStyleRuleEdit extends BaseContentEdit<SyntheticCSSStyleRule> {

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
  return <ArrayDiff<SyntheticCSSStyleRule>>diffArray(oldRules, newRules, (oldRule, newRule) => {
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

  applyEditAction(action: EditAction) {
    console.warn(`Cannot currently edit ${this.constructor.name}`);
  }

  cloneShallow(deep?: boolean) {
    return new SyntheticCSSStyleRule(this.selector, undefined);
  }

  visitWalker(walker: ITreeWalker) {
    walker.accept(this.style);
  }
}