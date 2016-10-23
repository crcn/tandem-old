import { CSSRuleExpression } from "./ast";
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
  BaseSyntheticObjectEdit,
  MoveChildEditAction,
  RemoveChildEditAction,
  InsertChildEditAction,
} from "@tandem/sandbox";

export type syntheticCSSRuleType = SyntheticCSSFontFace|SyntheticCSSKeyframesRule|SyntheticCSSMediaRule|SyntheticCSSStyleRule;

export interface ISerializedCSSStyleSheet {
  bundle: any;
  rules: Array<ISerializedContent<ISerializedSyntheticCSSStyleRule>>;
}

class SyntheticCSSStyleSheetSerializer implements ISerializer<SyntheticCSSStyleSheet, ISerializedCSSStyleSheet> {
  serialize(value: SyntheticCSSStyleSheet): ISerializedCSSStyleSheet {
    return {
      bundle: serialize(value.bundle),
      rules: value.rules.map(serialize)
    };
  }
  deserialize(value: ISerializedCSSStyleSheet, dependencies): SyntheticCSSStyleSheet {
    const styleSheet = new SyntheticCSSStyleSheet(value.rules.map(raw => deserialize(raw, dependencies)));
    styleSheet.$bundle = deserialize(value.bundle, dependencies);
    return styleSheet;
  }
}

export class SyntheticCSSStyleSheetEdit extends BaseSyntheticObjectEdit<SyntheticCSSStyleSheet> {

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

  addDiff(newStyleSheet: SyntheticCSSStyleSheet) {

    diffArray(this.target.rules, newStyleSheet.rules, (oldRule, newRule) => {
      if (oldRule.constructor.name !== newRule.constructor.name) return -1;

      if (oldRule instanceof SyntheticCSSStyleRule && (<SyntheticCSSStyleRule>oldRule).selector === (<SyntheticCSSStyleRule>newRule).selector) {
        return 0;
      }

      return (<SyntheticCSSObject>oldRule).createEdit().addDiff(<SyntheticCSSObject>newRule).actions.length;
    }).accept({
      visitInsert: ({ index, value }) => {
        this.insertRule(value, index);
      },
      visitRemove: ({ index }) => {
        this.removeRule(this.target.rules[index]);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, newIndex }) => {
        // TODO
      }
    });

    return this;
  }
}

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSStyleSheetSerializer()))
export class SyntheticCSSStyleSheet extends SyntheticCSSObject {

  public $bundle: Bundle;

  constructor(readonly rules: Array<syntheticCSSRuleType>) {
    super();
  }

  /**
   * @deprecated
   */

  get bundle() {
    return this.$bundle;
  }

  get cssText() {
    return this.rules.map((rule) => rule.cssText).join("\n");
  }

  toString() {
    return this.cssText;
  }

  clone(deep?: boolean) {
    const clone = new SyntheticCSSStyleSheet([]);
    if (deep) {
      for (let i = 0, n = this.rules.length; i < n; i++) {
        clone.rules.push(this.rules[i].clone(deep));
      }
    }
    return this.linkClone(clone);
  }

  createEdit() {
    return new SyntheticCSSStyleSheetEdit(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.rules.forEach((rule) => walker.accept(rule));
  }
}