import { DOMNodeType } from "@tandem/synthetic-browser/dom/markup/node-types";
import { SyntheticCSSObject } from "./base";
import { SyntheticDOMElement } from "@tandem/synthetic-browser/dom";
import { diffArray, ArrayMutation } from "@tandem/common";
import { SyntheticCSSFontFace } from "./font-face";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { isCSSGroupingStyleMutation } from "./grouping";
import { isInheritedCSSStyleProperty } from "./declaration";
import { SyntheticCSSAtRule, isCSSAtRuleMutaton } from "./atrule";
import { SyntheticCSSStyleRule, isCSSStyleRuleMutation } from "./style-rule";

export type syntheticCSSRuleType = SyntheticCSSStyleRule|SyntheticCSSAtRule;

export function diffStyleSheetRules(oldRules: syntheticCSSRuleType[], newRules: syntheticCSSRuleType[]) {
  return diffArray<syntheticCSSRuleType>(oldRules, newRules, (oldRule, newRule) => {
    if (oldRule.constructor.name !== newRule.constructor.name) return -1;
    return (<SyntheticCSSObject>oldRule).countShallowDiffs(<SyntheticCSSObject>newRule);
  });
}

export class MatchedCSSStyleRule {
  constructor(readonly target: SyntheticDOMElement, readonly rule: SyntheticCSSStyleRule, readonly overriddenStyleProperties: any, readonly inherited: boolean) {
  }
}

export function getMatchingStyleRules(target: SyntheticDOMElement) {

  const visited = {};
  const usedStyles = {};
  const matchCache = {};
  let jj = 0;

  function getStyleRules(element: SyntheticDOMElement, inherited?: boolean): MatchedCSSStyleRule[] {
    const matches = [];

    for (let i = element.ownerDocument.styleSheets.length; i--;) {

      const styleSheet = element.ownerDocument.styleSheets[i];
      const filePath   = styleSheet.source.filePath;

      for (let j = styleSheet.rules.length; j--;) {

        const rule = styleSheet.rules[j];

        if (!(rule instanceof SyntheticCSSStyleRule) || visited[rule.uid]) continue;
        const styleRule = <SyntheticCSSStyleRule>rule;
        if (styleRule.matchesElement(element)) {
          visited[rule.uid] = true;
          const overriddenStyleProperties = {};
          for (const property of styleRule.style) {
            if (usedStyles[property]) {
              overriddenStyleProperties[property] = true;
            } else {
              usedStyles[property] = true;
            }
          }

          matches.push(new MatchedCSSStyleRule(element, styleRule, overriddenStyleProperties, inherited));
        }
      }
    }

    return matches;
  }

  const matchedRules: MatchedCSSStyleRule[] = [];

  matchedRules.push(...getStyleRules(target));

  const inheritedRules = [];
  target.ancestors.forEach((ancestor) => {
    if (ancestor.nodeType === DOMNodeType.ELEMENT) {
      matchedRules.push(...getStyleRules(<SyntheticDOMElement>ancestor, true));
    }
  });

  return matchedRules;
}

export function isCSSMutation(mutation) {
  return isCSSGroupingStyleMutation(mutation) || isCSSStyleRuleMutation(mutation) || isCSSAtRuleMutaton(mutation);
}