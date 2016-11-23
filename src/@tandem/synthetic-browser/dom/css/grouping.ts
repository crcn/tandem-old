import { Mutation, InsertChildMutation, RemoveChildMutation, MoveChildMutation } from "@tandem/common";
import { parseCSS } from "./parser";
import { diffStyleSheetRules, syntheticCSSRuleType } from "./utils";
import { BaseEditor } from "@tandem/sandbox";
import { evaluateCSS } from "./evaluate";
import { SyntheticCSSObject, SyntheticCSSObjectEditor, SyntheticCSSObjectEdit } from "./base";

export namespace CSSGroupingRuleMutationTypes {
  export const INSERT_RULE_EDIT = "insertRuleEdit";
  export const REMOVE_RULE_EDIT = "removeRuleEdit";
  export const MOVE_RULE_EDIT   = "moveRuleEdit";
}

export class SyntheticCSSGroupingRuleEdit<T extends SyntheticCSSGroupingRule<syntheticCSSRuleType>> extends SyntheticCSSObjectEdit<T> {

  insertRule(rule: syntheticCSSRuleType, index: number) {
    return this.addChange(new InsertChildMutation(CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, this.target, rule.clone(true), index));
  }

  moveRule(rule: syntheticCSSRuleType, index: number, patchedOldIndex?: number) {
    return this.addChange(new MoveChildMutation(CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT, this.target, rule.clone(true), patchedOldIndex || this.target.rules.indexOf(rule), index));
  }

  removeRule(rule: syntheticCSSRuleType) {
    return this.addChange(new RemoveChildMutation(CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, this.target, rule, this.target.rules.indexOf(rule)));
  }

  protected addDiff(groupingRule: T) {
    super.addDiff(groupingRule);

    diffStyleSheetRules(this.target.rules, groupingRule.rules).accept({
      visitInsert: ({ index, value }) => {
        this.insertRule(value, index);
      },
      visitRemove: ({ index }) => {
        this.removeRule(this.target.rules[index]);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, index }) => {

        if (patchedOldIndex !== index) {
          this.moveRule(this.target.rules[originalOldIndex], index, patchedOldIndex);
        }

        const oldRule = this.target.rules[originalOldIndex];
        this.addChildEdit((<SyntheticCSSObject>oldRule).createEdit().fromDiff(<SyntheticCSSObject>newValue));
      }
    });

    return this;
  }
}

export class GenericCSSGroupingRuleEditor<T extends CSSStyleSheet|SyntheticCSSGroupingRule<any>> extends BaseEditor<T> {

  constructor(readonly target: T, readonly createInsertableCSSRule: (parent: T, child: any|CSSRule) => any = (parent, child) => child.cssText) {
    super(target);
  }  

  applySingleMutation(mutation: Mutation<any>) {

    if (mutation.type === CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT) {
      const { child, index } = (<InsertChildMutation<any, any>>mutation);
      this.target.insertRule(this.createInsertableCSSRule(this.target, child), index);
    } else if (mutation.type === CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT) {
      this.target.deleteRule((<RemoveChildMutation<any, any>>mutation).index)
    } else if (mutation.type === CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT) {
      const { oldIndex, child, index } = <MoveChildMutation<any, any>>mutation;
      
      const existingChild = this.target.cssRules[oldIndex];

      this.target.deleteRule(oldIndex);

      // TODO - move the existing instance -- don't just create a new one
      this.target.insertRule(this.createInsertableCSSRule(this.target, existingChild), index);
    }
  }
}

export class SyntheticCSSGroupingRuleEditor<T extends SyntheticCSSGroupingRule<any>> extends BaseEditor<T> {
  applyMutations(mutations: Mutation<any>[]) {
    new GenericCSSGroupingRuleEditor(this.target, (parent, child) => {
      return child.$parentRule === parent ? child : child.clone(true);
    }).applyMutations(mutations);
    new SyntheticCSSObjectEditor(this.target).applyMutations(mutations);
  }
}

export abstract class SyntheticCSSGroupingRule<T extends syntheticCSSRuleType> extends SyntheticCSSObject {

  constructor(readonly rules: T[] = []) {
    super();
    rules.forEach((rule) => this.linkRule(rule));
  }

  get cssRules() {
    return this.rules;
  }

  deleteRule(index: number) {
    this.cssRules.splice(index, 1);
  }

  createEditor() {
    return new SyntheticCSSGroupingRuleEditor<SyntheticCSSGroupingRule<any>>(this);
  }

  createEdit() {
    return new SyntheticCSSGroupingRuleEdit<SyntheticCSSGroupingRule<any>>(this);
  }

  insertRule(rule: T, index?: number): number;
  insertRule(rule: string, index?: number): number;
  insertRule(rule: any, index?: number): number {
    const ruleInstance: T = typeof rule === "string" ? evaluateCSS(parseCSS(rule))[0] : rule as T;
    this.rules.splice(index, 0, ruleInstance);
    this.linkRule(rule);
    return index;
  }

  protected linkRule(rule: T) {
    rule.$parentRule = this;
  }
}
