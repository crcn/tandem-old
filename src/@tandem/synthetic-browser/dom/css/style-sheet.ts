import { SyntheticCSSFontFace } from "./font-face";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import { SyntheticCSSStyleRule, ISerializedSyntheticCSSStyleRule } from "./style-rule";

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
  Bundle,
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
  deserialize(value: ISerializedCSSStyleSheet, dependencies): SyntheticCSSStyleSheet {
    return new SyntheticCSSStyleSheet(value.rules.map(raw => deserialize(raw, dependencies)));
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
    console.warn(`Cannot currently edit ${this.constructor.name}`);
  }

  createEdit() {
    return new SyntheticCSSStyleSheetEdit(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.rules.forEach((rule) => walker.accept(rule));
  }
}