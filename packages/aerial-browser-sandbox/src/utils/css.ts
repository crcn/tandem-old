import { weakMemo } from "aerial-common2";
import { getSyntheticNodeWindow, SyntheticCSSRule, SyntheticBrowser, SyntheticElement, SyntheticDocument, SyntheticCSSStyleSheet, SyntheticWindow, getSyntheticNodeById, getSyntheticWindowChild, SyntheticCSSStyleRule } from "../state";
import { flattenWindowObjectSources, matchesSelector, SEnvDocumentInterface, SEnvCSSStyleSheetInterface, SEnvCSSObjectInterface, CSSRuleType, SEnvCSSRuleInterface, flattenDocumentSources, SEnvCSSStyleRuleInterface } from "../environment";


// TODO - media query information here
export type MatchingCSSRuleResult = {
  rule: SyntheticCSSStyleRule;

  // properties that are inherited (color, font face)
  inheritedProperties?: {
    [identifier: string]: string
  }

  // properties that cannot be applied because of syntax errors
  invalidProperties?: {
    [identifier: string]: string
  }
}

const getDocumentCSSStyleRules = weakMemo((document: SyntheticDocument) => {
  const allRules: SEnvCSSStyleRuleInterface[] = [];
  const styleSheets = document.instance.stylesheets as any as SEnvCSSStyleSheetInterface[];
  const allChildObjects = flattenDocumentSources(document);
  for (const $id in allChildObjects) {
    const child = allChildObjects[$id] as any as SEnvCSSRuleInterface;
    if (child.type === CSSRuleType.STYLE_RULE) {
      allRules.push(child as SEnvCSSStyleRuleInterface);
    }
  }
  return allRules;
});

// TODO - consider media screen here too

export const getSyntheticMatchingCSSRules = weakMemo((window: SyntheticWindow, elementId: string) => {
  const element = getSyntheticWindowChild(window, elementId) as any as SyntheticElement;
  const document = element.instance.ownerDocument;
  const allRules = getDocumentCSSStyleRules(document.struct);
  
  const matchingRules: MatchingCSSRuleResult[] = [];

  console.log("RECOMPUTE");

  for (let i = 0, n = allRules.length; i < n; i++) {
    const rule = allRules[i];

    // no parent rule -- check
    if (!rule.parentRule) {
      if (element.instance.matches(rule.selectorText)) {
        matchingRules.push({
          rule: rule.struct
        });
      }
    // else - check if media rule
    } else {

    }
  }

  return matchingRules;
});



