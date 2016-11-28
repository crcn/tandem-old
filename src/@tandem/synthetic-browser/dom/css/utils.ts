import { camelCase, values, uniq } from "lodash";
import { DOMNodeType } from "@tandem/synthetic-browser/dom/markup/node-types";
import { SyntheticCSSObject } from "./base";
import { SyntheticDOMElement, SyntheticHTMLElement } from "@tandem/synthetic-browser/dom";
import { diffArray, ArrayMutation } from "@tandem/common";
import { SyntheticCSSFontFace } from "./font-face";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { isCSSGroupingStyleMutation } from "./grouping";
import { isInheritedCSSStyleProperty, SyntheticCSSStyle } from "./style";
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

export function eachMatchingStyleRule(element: SyntheticDOMElement, each: (rule: SyntheticCSSStyleRule) => any, filter?: (rule: SyntheticCSSStyleRule) => boolean) {
  if (!filter) filter = () => true;
  for (let i = element.ownerDocument.styleSheets.length; i--;) {
    const styleSheet = element.ownerDocument.styleSheets[i];
    for (let j = styleSheet.rules.length; j--;) {
      const rule = <SyntheticCSSStyleRule>styleSheet.rules[j]
      if (!(rule instanceof SyntheticCSSStyleRule) || !filter(rule) || !rule.matchesElement(element)) continue;
      each(rule);
    }
  }
}

export function eachInheritedMatchingStyleRule(element: SyntheticDOMElement, each: (element: SyntheticDOMElement, rule: SyntheticCSSStyleRule) => any, filter?: (rule: SyntheticCSSStyleRule) => boolean) {
  if (!filter) filter = () => true;

  const visited = {};

  const run = (current: SyntheticDOMElement) => {
    if (current.nodeType !== DOMNodeType.ELEMENT) return;
    eachMatchingStyleRule(current, (rule) => {
      visited[rule.uid] = true;
      each(current, rule);
    }, (rule) => !visited[rule.uid]);
  }

  run(element);
  element.ancestors.forEach(run);
}

export function getMatchingCSSStyleRules(target: SyntheticDOMElement) {

  const visited = {};
  const usedStyles = {};

  const matches = [];

  eachInheritedMatchingStyleRule(target, (current: SyntheticDOMElement, rule: SyntheticCSSStyleRule) => {
    const inherited = current !== target;
    const overriddenStyleProperties = {};
    for (const property of rule.style) {
      if (usedStyles[property]) {
        overriddenStyleProperties[property] = true;
      } else {
        usedStyles[property] = true;
      }
    }

    matches.push(new MatchedCSSStyleRule(current, rule, overriddenStyleProperties, inherited));
  });

  return matches;
}

export function isCSSMutation(mutation) {
  return isCSSGroupingStyleMutation(mutation) || isCSSStyleRuleMutation(mutation) || isCSSAtRuleMutaton(mutation);
}

