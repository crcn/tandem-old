import { evaluateCSS, parseCSS } from "@tandem/synthetic-browser/dom/css";
import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSGroupingRule, SyntheticCSSGroupingRuleEditor, SyntheticCSSGroupingRuleEdit } from "./grouping";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit,  SyntheticCSSObjectEditor  } from "./base";
import {
  serialize,
  Mutation,
  deserialize,
  serializable,
  ISerializer,
  ITreeWalker,
  ChildMutation,
  PropertyMutation,
  MoveChildMutation,
  ISerializedContent,
  InsertChildMutation,
  RemoveChildMutation,
} from "@tandem/common";

import {
  BaseEditor,
  BaseContentEdit,
} from "@tandem/sandbox";

import {diffStyleSheetRules } from "./utils";

export namespace SyntheticCSSAtRuleMutationTypes {
  export const SET_NAME_EDIT = "setNameEdit";
}

export function isCSSAtRuleMutaton(mutation: Mutation<SyntheticCSSAtRule>) {
  return !!{
    [SyntheticCSSAtRuleMutationTypes.SET_NAME_EDIT]: true
  }[mutation.type];
}

export class SyntheticCSSAtRuleEdit<T extends SyntheticCSSAtRule> extends SyntheticCSSGroupingRuleEdit<T> { }
export class SyntheticCSSAtRuleEditor<T extends SyntheticCSSAtRule>  extends SyntheticCSSGroupingRuleEditor<T> { }

export abstract class SyntheticCSSAtRule extends SyntheticCSSGroupingRule<SyntheticCSSStyleRule> {

  abstract atRuleName: string;
  abstract params: string;
  abstract cssText: string;

  constructor(cssRules: SyntheticCSSStyleRule[] = []) {
    super(cssRules);
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

  visitWalker(walker: ITreeWalker) {
    this.cssRules.forEach(rule => walker.accept(rule));
  }
}