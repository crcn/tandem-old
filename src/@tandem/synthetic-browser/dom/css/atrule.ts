import { evaluateCSS, parseCSS } from "@tandem/synthetic-browser/dom/css";
import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSStyleSheetMutationTypes } from "./style-sheet";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit,  SyntheticCSSObjectEditor,  } from "./base";
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
  BaseEditor,
  BaseContentEdit,
} from "@tandem/sandbox";

import {diffStyleSheetRules } from "./utils";

export namespace SyntheticCSSAtRuleMutationTypes {
  export const SET_NAME_EDIT        = "setNameEdit";
  export const INSERT_CSS_RULE_EDIT = SyntheticCSSStyleSheetMutationTypes.INSERT_STYLE_SHEET_RULE_EDIT;
  export const MOVE_CSS_RULE_EDIT   = SyntheticCSSStyleSheetMutationTypes.MOVE_STYLE_SHEET_RULE_EDIT;
  export const REMOVE_CSS_RULE_EDIT = SyntheticCSSStyleSheetMutationTypes.REMOVE_STYLE_SHEET_RULE_EDIT;
}

export class SyntheticCSSAtRuleEdit<T extends SyntheticCSSAtRule> extends SyntheticCSSObjectEdit<T> {

  insertRule(rule: SyntheticCSSStyleRule, index: number) {
    return this.addChange(new InsertChildMutation(SyntheticCSSAtRuleMutationTypes.INSERT_CSS_RULE_EDIT, this.target, rule, index));
  }

  moveRule(rule: SyntheticCSSStyleRule, index: number) {
    return this.addChange(new MoveChildMutation(SyntheticCSSAtRuleMutationTypes.MOVE_CSS_RULE_EDIT, this.target, rule, this.target.cssRules.indexOf(rule), index));
  }

  removeRule(rule: SyntheticCSSStyleRule) {
    return this.addChange(new RemoveChildMutation(SyntheticCSSAtRuleMutationTypes.REMOVE_CSS_RULE_EDIT, this.target, rule, this.target.cssRules.indexOf(rule)));
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
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, index }) => {
        const oldRule = this.target.cssRules[originalOldIndex];
        if (patchedOldIndex !== index) {
          this.moveRule(oldRule, index);
        }
        this.addChildEdit(oldRule.createEdit().fromDiff(<SyntheticCSSStyleRule>newValue));
      }
    })

    return this;
  }
}

export class GenericCSSAtRuleEditor extends BaseEditor<CSSGroupingRule|SyntheticCSSAtRule> {
  applyMutations(mutations: Mutation<any>[]) {
    super.applyMutations(mutations);
  }
  applySingleMutation(mutation: Mutation<any>) {

    if (mutation.type === SyntheticCSSAtRuleMutationTypes.REMOVE_CSS_RULE_EDIT) {
      this.target.deleteRule((<RemoveChildMutation<any, any>>mutation).index);
    } else if (mutation.type === SyntheticCSSAtRuleMutationTypes.INSERT_CSS_RULE_EDIT) {
      const { child, index } = <InsertChildMutation<any, SyntheticCSSStyleRule>>mutation;
      this.target.insertRule(child.cssText, index);
    } else if (mutation.type === SyntheticCSSAtRuleMutationTypes.MOVE_CSS_RULE_EDIT) {
      const { oldIndex, child, index } = <MoveChildMutation<any, SyntheticCSSStyleRule>>mutation;
      this.target.deleteRule(oldIndex);
      this.target.insertRule(child.cssText, index);
    }
  }
}

export class SyntheticCSSAtRuleEditor extends BaseEditor<SyntheticCSSAtRule> {

  private _genericCSSAtRuleEditor: GenericCSSAtRuleEditor;

  constructor(target: SyntheticCSSAtRule) {
    super(target);
    this._genericCSSAtRuleEditor = this.createCSSAtRuleEditor(target);
  }

  createCSSAtRuleEditor(target: SyntheticCSSAtRule) {
    return new GenericCSSAtRuleEditor(target);
  }

  applyMutations(mutations: Mutation<any>[]) {
    super.applyMutations(mutations);
    new SyntheticCSSObjectEditor(this.target).applyMutations(mutations);
    this._genericCSSAtRuleEditor.applyMutations(mutations);
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
  
  deleteRule(index: number): void {
    this.cssRules.splice(index, 1);
  }

  insertRule(rule: string, index: number): number {
    const styleSheet = evaluateCSS(parseCSS(rule));
    this.cssRules.splice(index, 0, styleSheet.rules[0] as SyntheticCSSStyleRule);
    return index;
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

  createEditor() {
    return new SyntheticCSSAtRuleEditor(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.cssRules.forEach(rule => walker.accept(rule));
  }
}