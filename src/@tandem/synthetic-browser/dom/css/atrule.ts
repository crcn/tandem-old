import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSStyleSheetChangeTypes } from "./style-sheet";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit,  } from "./base";
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

import {
  BaseContentEdit,
} from "@tandem/sandbox";

import {diffStyleSheetRules } from "./utils";

export namespace SyntheticCSSAtRuleChangeTypes {
  export const SET_NAME_EDIT        = "setNameEdit";
  export const INSERT_CSS_RULE_EDIT = SyntheticCSSStyleSheetChangeTypes.INSERT_STYLE_SHEET_RULE_EDIT;
  export const MOVE_CSS_RULE_EDIT   = SyntheticCSSStyleSheetChangeTypes.MOVE_STYLE_SHEET_RULE_EDIT;
  export const REMOVE_CSS_RULE_EDIT = SyntheticCSSStyleSheetChangeTypes.REMOVE_STYLE_SHEET_RULE_EDIT;
}

export class SyntheticCSSAtRuleEdit<T extends SyntheticCSSAtRule> extends SyntheticCSSObjectEdit<T> {

  insertRule(rule: SyntheticCSSStyleRule, index: number) {
    return this.addChange(new InsertChildMutation(SyntheticCSSAtRuleChangeTypes.INSERT_CSS_RULE_EDIT, this.target, rule, index));
  }

  moveRule(rule: SyntheticCSSStyleRule, index: number) {
    return this.addChange(new MoveChildMutation(SyntheticCSSAtRuleChangeTypes.MOVE_CSS_RULE_EDIT, this.target, rule, index));
  }

  removeRule(rule: SyntheticCSSStyleRule) {
    return this.addChange(new RemoveChildMutation(SyntheticCSSAtRuleChangeTypes.REMOVE_CSS_RULE_EDIT, this.target, rule));
  }

  addDiff(atRule: T) {
    super.addDiff(atRule);

    diffStyleSheetRules(this.target.cssRules, atRule.cssRules).accept({
      visitInsert: ({ index, value }) => {
        this.insertRule(<SyntheticCSSStyleRule>value, index);
      },
      visitRemove: ({ index }) => {
        this.removeRule(this.target.cssRules[index]);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, newIndex }) => {
        const oldRule = this.target.cssRules[originalOldIndex];
        if (patchedOldIndex !== newIndex) {
          this.moveRule(oldRule, newIndex);
        }
        this.addChildEdit(oldRule.createEdit().fromDiff(<SyntheticCSSStyleRule>newValue));
      }
    })

    return this;
  }
}

export abstract class SyntheticCSSAtRule extends SyntheticCSSObject {

  abstract atRuleName: string;
  abstract params: string;
  abstract cssText: string;

  constructor(public cssRules: SyntheticCSSStyleRule[] = []) {
    super();
    cssRules.forEach(rule => rule.$parentRule = this);
  }

  toString() {
    return this.cssText;
  }

  get innerText() {
    return this.cssRules.map(rule => rule.cssText).join("\n");
  }

  abstract cloneShallow();

  countShallowDiffs(target: SyntheticCSSAtRule) {
    return this.params === target.params ? 0 : -1;
  }

  applyEditChange(change: ApplicableMutation<any>) {
    change.applyTo(this.getEditChangeTargets()[change.type]);
    this.cssRules.forEach(rule => rule.$parentRule = this);
  }

  protected getEditChangeTargets() {
    return {
      [SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]: this as SyntheticCSSAtRule,
      [SyntheticCSSAtRuleChangeTypes.REMOVE_CSS_RULE_EDIT]: this.cssRules,
      [SyntheticCSSAtRuleChangeTypes.INSERT_CSS_RULE_EDIT]: this.cssRules,
      [SyntheticCSSAtRuleChangeTypes.MOVE_CSS_RULE_EDIT]: this.cssRules
    };
  }

  visitWalker(walker: ITreeWalker) {
    this.cssRules.forEach(rule => walker.accept(rule));
  }
}