import { SyntheticCSSObject } from "./base";
import { diffArray, ArrayDiff } from "@tandem/common";
import { SyntheticCSSFontFace } from "./font-face";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";

export type syntheticCSSRuleType = SyntheticCSSFontFace|SyntheticCSSKeyframesRule|SyntheticCSSMediaRule|SyntheticCSSStyleRule;

export function diffStyleSheetRules(oldRules: syntheticCSSRuleType[], newRules: syntheticCSSRuleType[]) {
  return diffArray(oldRules, newRules, (oldRule, newRule) => {
    if (oldRule.constructor.name !== newRule.constructor.name) return -1;
    return (<SyntheticCSSObject>oldRule).countShallowDiffs(<SyntheticCSSObject>newRule);
  });
}
