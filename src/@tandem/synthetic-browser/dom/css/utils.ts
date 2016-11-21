import { DOMNodeType } from "@tandem/synthetic-browser/dom/markup/node-types";
import { SyntheticCSSObject } from "./base";
import { SyntheticDOMElement } from "@tandem/synthetic-browser/dom";
import { diffArray, ArrayDiff } from "@tandem/common";
import { SyntheticCSSFontFace } from "./font-face";
import { isInheritedCSSStyleProperty } from "./declaration";
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

export class MatchedCSSStyleRule {
  constructor(readonly target: SyntheticDOMElement, readonly rule: SyntheticCSSStyleRule, readonly overridenStyleProperties: any, readonly inherited: boolean) {
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
          const overridenStyleProperties = {};
          for (const property of styleRule.style) {
            if (usedStyles[property]) {
              overridenStyleProperties[property] = true;
            } else {
              usedStyles[property] = true;
            }
          }

          matches.push(new MatchedCSSStyleRule(element, styleRule, overridenStyleProperties, inherited));
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