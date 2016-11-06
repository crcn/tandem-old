import { Dependency } from "@tandem/sandbox";
import { SyntheticDOMElement, getSelectorTester } from "@tandem/synthetic-browser";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit } from "./base";
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
export class SyntheticCSSStyleRuleEdit extends SyntheticCSSObjectEdit<SyntheticCSSStyleRule> {

  static readonly SET_DECLARATION = "setDeclaration";
  static readonly SET_RULE_SELECTOR = "setRuleSelector";

  setSelector(selector: string) {
    return this.addAction(new SetValueEditActon(SyntheticCSSStyleRuleEdit.SET_DECLARATION, this.target, selector));
  }

  setDeclaration(name: string, value: string, oldName?: string) {
    return this.addAction(new SetKeyValueEditAction(SyntheticCSSStyleRuleEdit.SET_DECLARATION, this.target, name, value, oldName));
  }

  addDiff(newRule: SyntheticCSSStyleRule) {
    super.addDiff(newRule);

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
    if (style) style.$parentRule = this;
  }

  createEdit() {
    return new SyntheticCSSStyleRuleEdit(this);
  }

  toString() {
    return this.cssText;
  }

  get cssText() {
    return `${this.selector} {\n${this.style.cssText}}`;
  }

  applyEditAction(action: EditAction) {
    if (action.type === SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT) {
      (<SetKeyValueEditAction>action).applyTo(this);
    } else {
      console.error(`Cannot apply ${action.type}`);
    }
  }

  cloneShallow(deep?: boolean) {
    return new SyntheticCSSStyleRule(this.selector, undefined);
  }

  matchesElement(element: SyntheticDOMElement) {
    return getSelectorTester(this.selector).test(element);
  }

  countShallowDiffs(target: SyntheticCSSStyleRule): number {
    return this.selector === target.selector ? 0 : -1;
  }

  visitWalker(walker: ITreeWalker) {
    walker.accept(this.style);
  }
}