import { atob } from "abab";
import { RawSourceMap } from "source-map";
import { SyntheticCSSFontFace } from "./font-face";
import { evaluateCSS, parseCSS } from "@tandem/synthetic-browser/dom/css";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { SyntheticObjectChangeTypes, BaseEditor } from "@tandem/sandbox";
import { SyntheticCSSStyleRule, ISerializedSyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit, SyntheticCSSObjectEditor } from "./base";

import {
  serialize,
  diffArray,
  deserialize,
  ITreeWalker,
  ISerializer,
  serializable,
  Mutation,
  MoveChildMutation,
  RemoveChildMutation,
  ApplicableMutation,
  InsertChildMutation,
  ISourceLocation,
  ISerializedContent
} from "@tandem/common";

import { syntheticCSSRuleType, diffStyleSheetRules } from "./utils";



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


export namespace SyntheticCSSStyleSheetMutationTypes {
  export const INSERT_STYLE_SHEET_RULE_EDIT = "insertStyleSheetRuleEdit";
  export const MOVE_STYLE_SHEET_RULE_EDIT   = "moveStyleSheetRuleEdit";
  export const REMOVE_STYLE_SHEET_RULE_EDIT = "removeStyleSheetRuleEdit";
}

export class SyntheticCSSStyleSheetEdit extends SyntheticCSSObjectEdit<SyntheticCSSStyleSheet> {


  insertRule(rule: syntheticCSSRuleType, index: number) {
    return this.addChange(new InsertChildMutation(SyntheticCSSStyleSheetMutationTypes.INSERT_STYLE_SHEET_RULE_EDIT, this.target, rule, index));
  }

  moveRule(rule: syntheticCSSRuleType, index: number) {
    return this.addChange(new MoveChildMutation(SyntheticCSSStyleSheetMutationTypes.MOVE_STYLE_SHEET_RULE_EDIT, this.target, rule, this.target.rules.indexOf(rule), index));
  }

  removeRule(rule: syntheticCSSRuleType) {
    return this.addChange(new RemoveChildMutation(SyntheticCSSStyleSheetMutationTypes.REMOVE_STYLE_SHEET_RULE_EDIT, this.target, rule, this.target.rules.indexOf(rule)));
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
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, index }) => {

        if (patchedOldIndex !== index) {
          this.moveRule(this.target.rules[originalOldIndex], index);
        }

        const oldRule = this.target.rules[originalOldIndex];
        this.addChildEdit((<SyntheticCSSObject>oldRule).createEdit().fromDiff(<SyntheticCSSObject>newValue));
      }
    });

    return this;
  }
}

export class GenericCSSStyleSheetEditor extends BaseEditor<CSSStyleSheet|SyntheticCSSStyleSheet> {
  applySingleMutation(mutation: Mutation<any>) {

    if (mutation.type === SyntheticCSSStyleSheetMutationTypes.INSERT_STYLE_SHEET_RULE_EDIT) {

    } else if (mutation.type === SyntheticCSSStyleSheetMutationTypes.REMOVE_STYLE_SHEET_RULE_EDIT) {

    } else if (mutation.type === SyntheticCSSStyleSheetMutationTypes.MOVE_STYLE_SHEET_RULE_EDIT) {

    }
    
    // change.applyTo({
    //   [SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]: this,
    //   [SyntheticCSSStyleSheetMutationTypes.INSERT_STYLE_SHEET_RULE_EDIT]: this.rules,
    //   [SyntheticCSSStyleSheetMutationTypes.REMOVE_STYLE_SHEET_RULE_EDIT]: this.rules,
    //   [SyntheticCSSStyleSheetMutationTypes.MOVE_STYLE_SHEET_RULE_EDIT]: this.rules
    // }[change.type]);
  }
}

export class SyntheticCSSStyleSheetEditor extends BaseEditor<SyntheticCSSStyleSheet> {
  applyMutations(mutations: Mutation<any>[]) {
    new SyntheticCSSObjectEditor(this.target).applyMutations(mutations);
    super.applyMutations(mutations);
  }
}

let _smcache = {};
function parseSourceMaps(value) {
  if (value.indexOf("sourceMappingURL") == -1) return undefined;
  if (_smcache[value]) return _smcache[value];
  const sourceMappingURL = value.match(/sourceMappingURL=(data\:[^\s]+)/)[1];

  // assuming that it's inlined here... shouldn't.
  return _smcache[value] = JSON.parse(atob(sourceMappingURL.split(",").pop()));
}

setInterval(() => _smcache = {}, 1000 * 60);

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
    .applyMutationsTo(this);
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


  createEditor() {
    // observe change
    // this.rules.forEach(rule => rule.$parentStyleSheet = this);
    return new SyntheticCSSStyleSheetEditor(this);
  }

  createEdit() {
    return new SyntheticCSSStyleSheetEdit(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.rules.forEach((rule) => walker.accept(rule));
  }
}