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

    diffArray(this.target.rules, newStyleSheet.rules, (oldRule, newRule) => {
      if (oldRule.constructor.name !== newRule.constructor.name) return -1;

      if (oldRule instanceof SyntheticCSSStyleRule && (<SyntheticCSSStyleRule>oldRule).selector === (<SyntheticCSSStyleRule>newRule).selector) {
        return 0;
      }

      return 0;
    }).accept({
      visitInsert: ({ index, value }) => {
        this.insertRule(value, index);
      },
      visitRemove: ({ index }) => {
        this.removeRule(this.target.rules[index]);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, newIndex }) => {
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
  }

  set cssText(value: string) {
    this
    .createEdit()
    .fromDiff(evaluateCSS(parseCSS(value)))
    .applyActionsTo(this);
  }

  get cssText() {
    return this.rules.map((rule) => rule.cssText).join("\n");
  }

  toString() {
    return this.cssText;
  }

  cloneShallow() {
    return new SyntheticCSSStyleSheet([]);
  }

  applyEditAction(action: EditAction) {

    if (action.type === SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT) {
      const {child, index} = <InsertChildEditAction>action;
      this.rules.splice(index, 0, child as syntheticCSSRuleType);
    } else if (action.type === SyntheticCSSStyleSheetEdit.REMOVE_STYLE_SHEET_RULE_EDIT) {
      const {child} = <RemoveChildEditAction>action;
      const found = this.rules.find(rule => rule.uid === child.uid);
      this.rules.splice(this.rules.indexOf(found), 1);
    }
  }

  createEdit() {
    return new SyntheticCSSStyleSheetEdit(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.rules.forEach((rule) => walker.accept(rule));
  }
}