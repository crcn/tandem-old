import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit } from "./base";
import { SyntheticCSSStyleSheetEdit } from "./style-sheet";
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

import {diffStyleSheetRules } from "./utils";

export class SyntheticCSSAtRuleEdit<T extends SyntheticCSSAtRule> extends SyntheticCSSObjectEdit<T> {

  static readonly SET_NAME_EDIT        = "setNameEdit";
  static readonly INSERT_CSS_RULE_EDIT = SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT;
  static readonly MOVE_CSS_RULE_EDIT   = SyntheticCSSStyleSheetEdit.MOVE_STYLE_SHEET_RULE_EDIT;
  static readonly REMOVE_CSS_RULE_EDIT = SyntheticCSSStyleSheetEdit.REMOVE_STYLE_SHEET_RULE_EDIT;

  insertRule(rule: SyntheticCSSStyleRule, index: number) {
    return this.addAction(new InsertChildEditAction(SyntheticCSSAtRuleEdit.INSERT_CSS_RULE_EDIT, this.target, rule, index));
  }

  moveRule(rule: SyntheticCSSStyleRule, index: number) {
    return this.addAction(new MoveChildEditAction(SyntheticCSSAtRuleEdit.MOVE_CSS_RULE_EDIT, this.target, rule, index));
  }

  removeRule(rule: SyntheticCSSStyleRule) {
    return this.addAction(new RemoveChildEditAction(SyntheticCSSAtRuleEdit.REMOVE_CSS_RULE_EDIT, this.target, rule));
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

  applyEditAction(action: ApplicableEditAction) {
    action.applyTo(this.getEditActionTargets()[action.type]);
  }

  protected getEditActionTargets() {
    return {
      [SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]: this as SyntheticCSSAtRule,
      [SyntheticCSSAtRuleEdit.REMOVE_CSS_RULE_EDIT]: this.cssRules,
      [SyntheticCSSAtRuleEdit.INSERT_CSS_RULE_EDIT]: this.cssRules,
      [SyntheticCSSAtRuleEdit.MOVE_CSS_RULE_EDIT]: this.cssRules
    };
  }

  visitWalker(walker: ITreeWalker) {
    this.cssRules.forEach(rule => walker.accept(rule));
  }
}