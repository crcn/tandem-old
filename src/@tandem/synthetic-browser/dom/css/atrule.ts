import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit } from "./base";
import { SyntheticCSSStyleRule, diffSyntheticCSSStyleRules } from "./style-rule";
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

export class SyntheticCSSAtRuleEdit<T extends SyntheticCSSAtRule> extends SyntheticCSSObjectEdit<T> {

  static readonly SET_NAME_EDIT        = "setNameEdit";
  static readonly INSERT_CSS_RULE_EDIT = "insertCSSRuleAtEdit";
  static readonly MOVE_CSS_RULE_EDIT   = "moveCSSRuleEdit";
  static readonly REMOVE_CSS_RULE_EDIT = "removeCSSRuleEdit";

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

    diffSyntheticCSSStyleRules(this.target.cssRules, atRule.cssRules).accept({
      visitInsert: ({ index, value }) => {
        this.insertRule(value, index);
      },
      visitRemove: ({ index }) => {
        this.removeRule(this.target.cssRules[index]);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, newIndex }) => {
        const oldRule = this.target.cssRules[originalOldIndex];
        if (originalOldIndex !== patchedOldIndex) {
          this.moveRule(oldRule, newIndex);
        }
        this.addChildEdit(oldRule.createEdit().fromDiff(newValue));
      }
    })

    return this;
  }
}

export abstract class SyntheticCSSAtRule extends SyntheticCSSObject {
  abstract name: string;
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

  abstract countShallowDiffs(target: SyntheticCSSAtRule);

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