import { weakMemo } from "aerial-common2";

import { 
  SyntheticWindow, 
  SyntheticCSSRule, 
  SyntheticBrowser, 
  SyntheticElement, 
  SyntheticDocument, 
  getSyntheticNodeById, 
  SyntheticCSSStyleRule,
  getSyntheticNodeWindow, 
  SyntheticCSSStyleSheet, 
  getSyntheticWindowChild, 
  getSyntheticNodeAncestors,
  SyntheticCSSStyleDeclaration,
} from "../state";

import { 
  CSSRuleType, 
  matchesSelector, 
  SEnvCSSRuleInterface, 
  SEnvDocumentInterface, 
  SEnvCSSObjectInterface, 
  SEnvHTMLElementInterface,
  flattenDocumentSources,
  SEnvCSSStyleRuleInterface,
  flattenWindowObjectSources,
  SEnvCSSStyleSheetInterface, 
  SEnvCSSStyleDeclarationInterface,
} from "../environment";

import {
  INHERITED_CSS_STYLE_PROPERTIES
} from "../constants";

type StyledObject = {
  label?: string;
  selectorText?: string;
  style: SyntheticCSSStyleDeclaration;
  $id: string;
};

// TODO - media query information here
export type AppliedCSSRuleResult = {

  inherited?: boolean;

  rule: StyledObject;

  // property rules that are 
  ignoredPropertyNames?: {
    [identifier: string]: boolean
  }

  // properties overridden by a style rule with a higher priority
  overriddenPropertyNames?: {
    [identifier: string]: boolean
  }
}


export const containsInheritableStyleProperty = (style: SyntheticCSSStyleDeclaration) => {
  for (const propertyName in style) {
    if (INHERITED_CSS_STYLE_PROPERTIES[propertyName]) {
      return true;
    }
  }
  return false;
};

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
  
  const matchingRules: StyledObject[] = [];

  const elementStyle = (element.instance as any as SEnvHTMLElementInterface).style as SEnvCSSStyleDeclarationInterface;

  if (elementStyle && elementStyle.length) {
    matchingRules.push({
      label: `${element.nodeName.toLowerCase()} style`,
      $id: element.$id,
      style: elementStyle.struct
    });
  }

  for (let i = 0, n = allRules.length; i < n; i++) {
    const rule = allRules[i];

    // no parent rule -- check
    if (!rule.parentRule) {
      if (element.instance.matches(rule.selectorText)) {
        matchingRules.push(rule.struct);
      }
    // else - check if media rule
    } else {

    }
  }

  return matchingRules;
});

const getSyntheticInheritableCSSRules = weakMemo((window: SyntheticWindow, elementId: string) => {
  const matchingCSSRules = getSyntheticMatchingCSSRules(window, elementId);
  
  const inheritableCSSRules: StyledObject[] = [];

  for (let i = 0, n = matchingCSSRules.length; i < n; i++) {
    const rule = matchingCSSRules[i];
    if (containsInheritableStyleProperty(rule.style)) {
      inheritableCSSRules.push(rule);
    }
  }

  return inheritableCSSRules;
});

export const getSyntheticAppliedCSSRules = weakMemo((window: SyntheticWindow, elementId: string) => {
  const element = getSyntheticWindowChild(window, elementId) as any as SyntheticElement;
  const document = element.instance.ownerDocument;
  const allRules = getDocumentCSSStyleRules(document.struct);

  // first grab the rules that are applied directly to the element
  const matchingRules = getSyntheticMatchingCSSRules(window, elementId);

  const appliedPropertNames = {};
  const appliedStyleRules = {};

  const appliedRules: AppliedCSSRuleResult[] = [];

  for (let i = matchingRules.length; i--;) {
    const matchingRule = matchingRules[i];

    appliedStyleRules[matchingRule.$id] = true;

    const overriddenPropertyNames = {};

    for (const propertyName in matchingRule.style) {
      if (appliedPropertNames[propertyName]) {
        overriddenPropertyNames[propertyName] = true;
      } else if(!matchingRule.style.disabledPropertyNames || !matchingRule.style.disabledPropertyNames[propertyName]) {
        appliedPropertNames[propertyName] = true;
      }
    }

    appliedRules.push({
      inherited: false,
      rule: matchingRule,
      overriddenPropertyNames,
    });
  }

  // next, fetch the style rules that have inheritable properties such as font-size, color, etc. 
  const ancestors = getSyntheticNodeAncestors(element, window);

  // reduce by 1 to omit #document
  for (let i = 0, n = ancestors.length - 1; i < n; i++) {
    const ancestor = ancestors[i];
    const inheritedRules = getSyntheticInheritableCSSRules(window, ancestor.$id);

    for (let j = inheritedRules.length; j--;) {
      const ancestorRule = inheritedRules[j];
      
      if (appliedStyleRules[ancestorRule.$id]) {
        continue;
      }
      
      appliedStyleRules[ancestorRule.$id] = true;

      const overriddenPropertyNames = {};
      const ignoredPropertyNames   = {};
      for (const propertyName in ancestorRule.style) {
        if (!INHERITED_CSS_STYLE_PROPERTIES[propertyName]) {
          ignoredPropertyNames[propertyName] = true;
        } else if (appliedPropertNames[propertyName]) {
          overriddenPropertyNames[propertyName] = true;
        } else if(!ancestorRule.style.disabledPropertyNames || !ancestorRule.style.disabledPropertyNames[propertyName]) {
          appliedPropertNames[propertyName] = true;
        }
      }

      appliedRules.push({
        inherited: true,
        rule: ancestorRule,
        ignoredPropertyNames,
        overriddenPropertyNames,
      });
    }
  }

  return appliedRules;
});



