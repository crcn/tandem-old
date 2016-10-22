import { Bundle } from "@tandem/sandbox";
import { CSSRuleExpression } from "./ast";
import { BaseContentEdit, EditAction, EditKind } from "@tandem/sandbox";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import { ISerializedSyntheticCSSStyleDeclaration, SyntheticCSSStyleDeclaration } from "./declaration";
import { Action, serializable, serialize, deserialize, ISerializer, ISerializedContent } from "@tandem/common";

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
export class SyntheticCSSStyleRuleEdit extends BaseContentEdit<SyntheticCSSStyleRule> {
  setSelector(selector: string) {
    return this.addAction(new SetRuleSelectorEditAction(this.target, selector));
  }
  setDeclaration(name: string, value: string, newName?: string) {
    return this.addAction(new SetDeclarationEditAction(this.target, name, value, newName));
  }
}

export class SetRuleSelectorEditAction extends EditAction {
  static readonly SET_RULE_SELECTOR = "setRuleSelector";
  constructor(rule: SyntheticCSSStyleRule, readonly selector: string) {
    super(SetRuleSelectorEditAction.SET_RULE_SELECTOR, EditKind.UPDATE, rule);
  }
}

export class SetDeclarationEditAction extends EditAction {
  static readonly SET_DECLARATION = "setDeclaration";
  constructor(rule: SyntheticCSSStyleRule, readonly name: string, readonly newValue: string, readonly newName?: string) {
    super(SetDeclarationEditAction.SET_DECLARATION, EditKind.UPDATE, rule);
  }
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
}