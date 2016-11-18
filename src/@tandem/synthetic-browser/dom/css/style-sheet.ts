import { atob } from "abab";
import { RawSourceMap } from "source-map";
import { SyntheticCSSFontFace } from "./font-face";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit } from "./base";
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

import { syntheticCSSRuleType, diffStyleSheetRules } from "./utils";

import {
  Dependency,
  EditChange,
  BaseContentEdit,
  MoveChildEditChange,
  RemoveChildEditChange,
  ApplicableEditChange,
  InsertChildEditChange,
} from "@tandem/sandbox";


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

export class SyntheticCSSStyleSheetEdit extends SyntheticCSSObjectEdit<SyntheticCSSStyleSheet> {

  static readonly INSERT_STYLE_SHEET_RULE_EDIT = "insertStyleSheetRuleEdit";
  static readonly MOVE_STYLE_SHEET_RULE_EDIT   = "moveStyleSheetRuleEdit";
  static readonly REMOVE_STYLE_SHEET_RULE_EDIT = "removeStyleSheetRuleEdit";

  insertRule(rule: syntheticCSSRuleType, index: number) {
    return this.addChange(new InsertChildEditChange(SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT, this.target, rule, index));
  }

  moveRule(rule: syntheticCSSRuleType, index: number) {
    return this.addChange(new MoveChildEditChange(SyntheticCSSStyleSheetEdit.MOVE_STYLE_SHEET_RULE_EDIT, this.target, rule, index));
  }

  removeRule(rule: syntheticCSSRuleType) {
    return this.addChange(new RemoveChildEditChange(SyntheticCSSStyleSheetEdit.REMOVE_STYLE_SHEET_RULE_EDIT, this.target, rule));
  }

  protected addDiff(newStyleSheet: SyntheticCSSStyleSheet) {
    super.addDiff(newStyleSheet);

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

const _smcache = {};
function parseSourceMaps(value) {
  if (value.indexOf("sourceMappingURL") == -1) return undefined;
  if (_smcache[value]) return _smcache[value];
  const sourceMappingURL = value.match(/sourceMappingURL=(data\:[^\s]+)/)[1];

  // assuming that it's inlined here... shouldn't.
  return _smcache[value] = JSON.parse(atob(sourceMappingURL.split(",").pop()));
}

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSStyleSheetSerializer()))
export class SyntheticCSSStyleSheet extends SyntheticCSSObject {

  constructor(readonly rules: Array<syntheticCSSRuleType>) {
    super();
    rules.forEach(rule => rule.$parentStyleSheet = this);
  }

  set cssText(value: string) {
    let map: RawSourceMap = parseSourceMaps(value);
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

  applyEditChange(action: ApplicableEditChange) {
    action.applyTo({
      [SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]: this,
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