import * as atob from "atob";
import { RawSourceMap } from "source-map";
import { SyntheticCSSFontFace } from "./font-face";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import { SyntheticCSSStyleRule, ISerializedSyntheticCSSStyleRule } from "./style-rule";
import { evaluateCSS, parseCSS } from "@tandem/synthetic-browser/dom/css";

import {
  serialize,
  diffArray,
  deserialize,
  ITreeWalker,
  ISerializer,
  serializable,
  ISourceLocation,
  ISerializedContent
} from "@tandem/common";

import {
  Dependency,
  EditAction,
  BaseContentEdit,
  MoveChildEditAction,
  RemoveChildEditAction,
  ApplicableEditAction,
  InsertChildEditAction,
} from "@tandem/sandbox";


export type syntheticCSSRuleType = SyntheticCSSFontFace|SyntheticCSSKeyframesRule|SyntheticCSSMediaRule|SyntheticCSSStyleRule;

export interface ISerializedCSSStyleSheet {
  rules: Array<ISerializedContent<ISerializedSyntheticCSSStyleRule>>;
}

class SyntheticCSSStyleSheetSerializer implements ISerializer<SyntheticCSSStyleSheet, ISerializedCSSStyleSheet> {
  serialize(value: SyntheticCSSStyleSheet): ISerializedCSSStyleSheet {
    return {
      rules: value.rules.map(serialize)
    };
  }
  deserialize(value: ISerializedCSSStyleSheet, injector): SyntheticCSSStyleSheet {
    return new SyntheticCSSStyleSheet(value.rules.map(raw => deserialize(raw, injector)));
  }
}

function diffStyleSheetRules(oldRules: syntheticCSSRuleType[], newRules: syntheticCSSRuleType[]) {
  return diffArray(oldRules, newRules, (oldRule, newRule) => {
    if (oldRule.constructor.name !== newRule.constructor.name) return -1;
    return (<SyntheticCSSObject>oldRule).countShallowDiffs(<SyntheticCSSObject>newRule);
  });
}

export class SyntheticCSSStyleSheetEdit extends BaseContentEdit<SyntheticCSSStyleSheet> {

  static readonly INSERT_STYLE_SHEET_RULE_EDIT = "insertStyleSheetRuleEdit";
  static readonly MOVE_STYLE_SHEET_RULE_EDIT   = "moveStyleSheetRuleEdit";
  static readonly REMOVE_STYLE_SHEET_RULE_EDIT = "removeStyleSheetRuleEdit";

  insertRule(newRule: syntheticCSSRuleType, index: number) {
    return this.addAction(new InsertChildEditAction(SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT, this.target, newRule, index));
  }

  moveRule(rule: syntheticCSSRuleType, index: number) {
    return this.addAction(new MoveChildEditAction(SyntheticCSSStyleSheetEdit.MOVE_STYLE_SHEET_RULE_EDIT, this.target, rule, index));
  }

  removeRule(rule: syntheticCSSRuleType) {
    return this.addAction(new RemoveChildEditAction(SyntheticCSSStyleSheetEdit.REMOVE_STYLE_SHEET_RULE_EDIT, this.target, rule));
  }

  protected addDiff(newStyleSheet: SyntheticCSSStyleSheet) {
    diffStyleSheetRules(this.target.rules, newStyleSheet.rules).accept({
      visitInsert: ({ index, value }) => {
        this.insertRule(value, index);
      },
      visitRemove: ({ index }) => {
        this.removeRule(this.target.rules[index]);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, newIndex }) => {

        if (patchedOldIndex !== newIndex) {
          this.moveRule(this.target.rules[originalOldIndex], newIndex);
        }

        const oldRule = this.target.rules[originalOldIndex];
        this.addChildEdit((<SyntheticCSSObject>oldRule).createEdit().fromDiff(<SyntheticCSSObject>newValue));
      }
    });

    return this;
  }
}

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSStyleSheetSerializer()))
export class SyntheticCSSStyleSheet extends SyntheticCSSObject {

  constructor(readonly rules: Array<syntheticCSSRuleType>) {
    super();
    rules.forEach(rule => rule.$parentStyleSheet = this);
  }

  set cssText(value: string) {

    let map: RawSourceMap;

    if (value.indexOf("sourceMappingURL") !== -1) {
      const sourceMappingURL = value.match(/sourceMappingURL=([^\s]+)/)[1];

      // assuming that it's inlined here... shouldn't.
      map = JSON.parse(atob(sourceMappingURL.split(",").pop()));
    }

    this
    .createEdit()
    .fromDiff(evaluateCSS(parseCSS(value, map), map))
    .applyActionsTo(this);
  }

  get cssText() {
    return this.rules.map((rule) => rule.cssText).join("\n");
  }

  toString() {
    return this.cssText;
  }

  countShallowDiffs(target: SyntheticCSSStyleSheet) {

    // This condition won't work as well for cases where the stylesheet is defined
    // by some other code such as <style /> blocks. It *will* probably break if the source
    // that instantiated this SyntheticCSSStyleSheet instance maintains a reference to it. Though, that's
    // a totally different problem that needs to be resolved.
    if (target.source.filePath === this.source.filePath) return 0;

    return diffStyleSheetRules(this.rules, target.rules).count;
  }

  cloneShallow() {
    return new SyntheticCSSStyleSheet([]);
  }

  applyEditAction(action: ApplicableEditAction) {
    action.applyTo({
      [SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT]: this.rules,
      [SyntheticCSSStyleSheetEdit.REMOVE_STYLE_SHEET_RULE_EDIT]: this.rules,
      [SyntheticCSSStyleSheetEdit.MOVE_STYLE_SHEET_RULE_EDIT]: this.rules
    }[action.type]);
  }

  createEdit() {
    return new SyntheticCSSStyleSheetEdit(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.rules.forEach((rule) => walker.accept(rule));
  }
}