import { Dependency } from "@tandem/sandbox";
import { SyntheticDOMElement, getSelectorTester } from "@tandem/synthetic-browser";
import { BaseContentEdit, SyntheticObjectChangeTypes, BaseEditor } from "@tandem/sandbox";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit, SyntheticCSSObjectEditor } from "./base";
import { ISerializedSyntheticCSSStyleDeclaration, SyntheticCSSStyleDeclaration, isValidCSSDeclarationProperty } from "./declaration";
import {
  Action,
  Mutation,
  serialize,
  ArrayDiff,
  diffArray,
  serializable,
  deserialize,
  ISerializer,
  ITreeWalker,
  PropertyMutation,
  SetValueMutation,
  ISerializedContent,
} from "@tandem/common";

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

export namespace SyntheticCSSStyleRuleMutationTypes {
  export const SET_DECLARATION = "setDeclaration";
  export const SET_RULE_SELECTOR = "setRuleSelector";
}

// TODO - move this to synthetic-browser
export class SyntheticCSSStyleRuleEdit extends SyntheticCSSObjectEdit<SyntheticCSSStyleRule> {

  setSelector(selector: string) {
    return this.addChange(new SetValueMutation(SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION, this.target, selector));
  }

  setDeclaration(name: string, value: string, oldName?: string, index?: number) {
    return this.addChange(new PropertyMutation(SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION, this.target, name, value, oldName, index));
  }

  addDiff(newRule: SyntheticCSSStyleRule) {
    super.addDiff(newRule);

    if (this.target.selector !== newRule.selector) {
      this.setSelector(newRule.selector);
    }

    const oldKeys = Object.keys(this.target.style).filter(isValidCSSDeclarationProperty as any);
    const newKeys = Object.keys(newRule.style).filter(isValidCSSDeclarationProperty as any);

    diffArray(oldKeys, newKeys, (a, b) => {
      return a === b ? 0 : -1;
    }).accept({
      visitInsert: ({ value, index }) => {
        this.setDeclaration(value, newRule.style[value], undefined, index);
      },
      visitRemove: ({ index }) => {

        // don't apply a move edit if the value doesn't exist.
        if (this.target.style[oldKeys[index]]) {
          this.setDeclaration(oldKeys[index], undefined);
        }
      },
      visitUpdate: ({ originalOldIndex, newValue, index }) => {
        if (this.target.style[newValue] !== newRule.style[newValue]) {
          this.setDeclaration(newValue, newRule.style[newValue], undefined, index);
        }
      }
    });

    return this;
  }
}

export class CSSStyleRuleEditor extends BaseEditor<CSSStyleRule> {
  applySingleMutation(mutation: Mutation<any>) {
    if (mutation.type === SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION) {
      const { name, newValue, oldName } = <PropertyMutation<any>>mutation;
      this.target.style.setProperty(name, newValue);
      if (newValue == null) {
        this.target.style.removeProperty(name);
      }
      if (oldName) {
        this.target.style.removeProperty(oldName);
      }
    } else {
      console.error(`Cannot apply ${mutation.type}`);
    }
  }
}

export class SyntheticCSSStyleRuleEditor extends BaseEditor<SyntheticCSSStyleRule> {
  applySingleMutation(mutation: Mutation<SyntheticCSSStyleRule>) {
    new SyntheticCSSObjectEditor(this.target).applyMutations([mutation]);

    if (mutation.type === SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT) {
      (<PropertyMutation<any>>mutation).applyTo(this);
    } else if (mutation.type === SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION) {
      const { name, newValue, oldName } = <PropertyMutation<any>>mutation;
      this.target.style.setProperty(name, newValue, undefined, oldName);
    } else {
      console.error(`Cannot apply ${mutation.type}`);
    }
  }
}

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSStyleRuleSerializer()))
export class SyntheticCSSStyleRule extends SyntheticCSSObject {

  constructor(public selector: string, public style: SyntheticCSSStyleDeclaration) {
    super();
    if (!style) style = this.style = new SyntheticCSSStyleDeclaration();
    style.$parentRule = this;
  }

  createEdit() {
    return new SyntheticCSSStyleRuleEdit(this);
  }

  toString() {
    return this.cssText;
  }

  get cssText() {
    return `${this.selector} {\n${this.style.cssText}}\n`;
  }

  createEditor() {
    return new SyntheticCSSStyleRuleEditor(this);
  }

  applyMutation(mutation: Mutation<any>) {
    if (this.$ownerNode) this.$ownerNode.notify(mutation);
    if (mutation.type === SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT) {
      (<PropertyMutation<any>>mutation).applyTo(this);
    } else if (mutation.type === SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION) {
      const { name, newValue, oldName } = <PropertyMutation<any>>mutation;
      this.style.setProperty(name, newValue, undefined, oldName);
    } else {
      console.error(`Cannot apply ${mutation.type}`);
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