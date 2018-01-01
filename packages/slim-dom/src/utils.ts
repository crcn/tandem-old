import { SlimParentNode, SlimBaseNode, SlimVMObjectType, SlimElement, SlimTextNode, VMObject, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSGroupingRule, SlimCSSAtRule, SlimCSSRule, SlimCSSStyleSheet, VMObjectSource, SlimStyleElement, SlimElementAttribute, SlimWindow } from "./state";
import { querySelector, elementMatches } from "./query-selector";
import { createMediaMatcher } from "./media-match";
import { uniq, flatten, kebabCase, camelCase } from "lodash";
import { INHERITED_CSS_STYLE_PROPERTIES } from "./constants";
import crc32 = require("crc32");
import { weakMemo } from "./weak-memo";
export { weakMemo };
export const pushChildNode = <TParent extends SlimParentNode>(parent: TParent, child: SlimBaseNode): TParent => ({
  ...(parent as any),
  childNodes: [
    ...parent.childNodes,
    child
  ]
});

export const removeChildNodeAt = <TParent extends SlimParentNode>(parent: TParent, index: number): TParent => ({
  ...(parent as any),
  childNodes: [
    ...parent.childNodes.slice(0, index),
    ...parent.childNodes.slice(index + 1)
  ]
});

export const insertChildNode = <TParent extends SlimParentNode>(parent: TParent, child: SlimBaseNode, index: number = Number.MAX_SAFE_INTEGER): TParent => ({
  ...(parent as any),
  childNodes: [
    ...parent.childNodes.slice(0, index),
    child,
    ...parent.childNodes.slice(index)
  ]
});

export const moveChildNode = <TParent extends SlimParentNode>(parent: TParent, index: number, newIndex: number) => {

  const childNodes = [...parent.childNodes];
  const child = childNodes[index];
  childNodes.splice(index, 1);
  childNodes.splice(newIndex, 0, child);
  
  return {
    ...(parent as any),
    childNodes
  };
};

export const insertCSSRule = <TParent extends SlimCSSGroupingRule>(parent: TParent, child: SlimBaseNode, index: number = Number.MAX_SAFE_INTEGER): TParent => ({
  ...(parent as any),
  rules: [
    ...parent.rules.slice(0, index),
    child,
    ...parent.rules.slice(index)
  ]
});

export const removeCSSRuleAt = <TParent extends SlimCSSGroupingRule>(parent: TParent, index: number): TParent => ({
  ...(parent as any),
  rules: [
    ...parent.rules.slice(0, index),
    ...parent.rules.slice(index + 1)
  ]
});

export const moveCSSRule = <TParent extends SlimCSSGroupingRule>(parent: TParent, index: number, newIndex: number): TParent => {

  const rules = [...parent.rules];
  const child = rules[index];
  rules.splice(index, 1);
  rules.splice(newIndex, 0, child);
  
  return {
    ...(parent as any),
    rules
  };
};

export const setCSSSelectorText = <TRule extends SlimCSSStyleRule>(rule: TRule, selectorText: string): TRule => ({
  ...(rule as any),
  selectorText
});

export const setCSSAtRuleSetParams = <TRule extends SlimCSSAtRule>(rule: TRule, params: string): TRule => ({
  ...(rule as any),
  params
});

export const setCSSStyleProperty = <TRule extends SlimCSSStyleRule>(rule: TRule, name: string, newValue: any, index: number): TRule => ({
  ...(rule as any), 
  style: {
    ...rule.style,
    [name]: newValue
  }
});

export const parseStyle = weakMemo((styleStr: string) => {
  const style = {};
  styleStr.split(";").forEach(part => {
    const [name, ...rest] = part.split(":");
    if (!name) return;
    style[camelCase(name.trim())] = rest.join(":").trim();
  });
  return style;
});

export const stringifyStyle = (style: any) => {
  let buffer = ``;
  for (const key in style) {
    buffer += `${cssPropNameToKebabCase(key)}: ${style[key]};`
  }

  return buffer;
}

export const stringifyNode = weakMemo((node: SlimBaseNode, includeShadow?: boolean) => {
  switch(node.type) {
    case SlimVMObjectType.TEXT: {
      const text = node as SlimTextNode;
      return text.value;
    }
    case SlimVMObjectType.ELEMENT: {
      const el = node as SlimElement;
      let buffer = `<${el.tagName} `;
      for (let i = 0, {length} = el.attributes; i < length; i++) {
        const attr = el.attributes[i];
        buffer += ` ${attr.name}=${JSON.stringify(attr.value)}`;
      }
      buffer += `>`;
      if (includeShadow && el.shadow)  {
        buffer += `<#shadow>`;
        buffer += stringifyNode(el.shadow, includeShadow);
        buffer += `</#shadow>`;
      }
      for (let i = 0, {length} = el.childNodes; i < length; i++) {
        buffer += stringifyNode(el.childNodes[i], includeShadow);
      }
      buffer += `</${el.tagName}>`;
      return buffer;
    }
    case SlimVMObjectType.DOCUMENT_FRAGMENT: 
    case SlimVMObjectType.DOCUMENT: {
      const el = node as SlimParentNode;
      let buffer = ``;
      for (let i = 0, {length} = el.childNodes; i < length; i++) {
        buffer += stringifyNode(el.childNodes[i], includeShadow);
      }
      return buffer;
    }
  }
});

export const getAttribute = (name: string, element: SlimElement) => element.attributes.find(attribute => attribute.name === name);

export const hasAttribute = (name: string, element: SlimElement) => {
  return getAttribute(name, element) != null;
};

export const getAttributeValue = (name: string, element: SlimElement) => {
  const attribute = getAttribute(name, element);
  return attribute && attribute.value;
};

export type FlattenedObject = {
  parentId: string;
  value: VMObject;
};

export type FlattenedObjects = {
  [identifier: string]: FlattenedObject;
};

const MAX_ANCESTOR_COUNT = 1000 * 10;

export const getNodeAncestors = weakMemo((value: SlimBaseNode, root: SlimParentNode): SlimParentNode[] => {
  const objects = flattenObjects(root);
  let current = objects[objects[value.id].parentId];
  let ancestors: SlimParentNode[] = [];

  let i = 0;
  while(current) {
    ancestors.push(current.value as any as SlimParentNode);
    if (!current.parentId) {
      break;
    }
    current = objects[current.parentId];
    if (i++ > MAX_ANCESTOR_COUNT) {
      throw new Error(`Infinite loop detected`);
    }
  }

  return ancestors;
});

export const getVMObjectPath = weakMemo((value: SlimBaseNode, root: SlimParentNode): any[] => {
  const objects = flattenObjects(root);
  let current = objects[value.id];
  const path: any[] = [];

  while(current && current.parentId) {
    const parentInfo = objects[current.parentId];

    // TODO - check if css rules
    if ((parentInfo.value as SlimElement).shadow === current.value) { 
      path.unshift("shadow");
    } else if ((parentInfo.value as SlimStyleElement).sheet === current.value) {
      path.unshift("sheet");
    } else if ((parentInfo.value as SlimParentNode).childNodes) {
      path.unshift((parentInfo.value as SlimParentNode).childNodes.indexOf(current.value));
    } else if ((parentInfo.value as SlimCSSGroupingRule).rules) {
      path.unshift((parentInfo.value as SlimCSSGroupingRule).rules.indexOf(current.value));
    }
    current = parentInfo;
  }

  return path;
});

// not memoized because this isn't a very expensive op
export const getVMObjectFromPath = (path: any[], root: VMObject): VMObject => {
  let current = root;
  for (let i = 0, {length} = path; i < length; i++) {
    const part = path[i];
    if (part === "shadow") {
      current = (current as SlimElement).shadow;
    } else if (part === "sheet") {
      current = (current as SlimStyleElement).sheet;
    } else if ((current as SlimParentNode).childNodes) {
      current = (current as SlimParentNode).childNodes[part];
    } else if ((current as SlimCSSGroupingRule).rules) {
      current = (current as SlimCSSGroupingRule).rules[part];
    }

    if (!current) {
      return null;
    }
  }

  return current;
};

export const getVmObjectSourceUris = weakMemo((node: SlimBaseNode) => {
  return uniq(getNestedSourceUris(node));
});

const getNestedSourceUris = weakMemo((node: VMObject): string[] => {
  const sources: string[] = [];
  if (node.source && node.source.uri) {
    sources.push(node.source.uri);
  }
  if (node.type === SlimVMObjectType.ELEMENT) {
    const element = node as SlimElement;
    if (element.shadow) {
      sources.push(...getNestedSourceUris(element.shadow));
    }

    if (element.tagName === "style") {
      sources.push(...getNestedSourceUris((element as SlimStyleElement).sheet));
    }
  }

  if (node.type === SlimVMObjectType.STYLE_SHEET || node.type === SlimVMObjectType.AT_RULE) {
    const grouping = node as SlimCSSGroupingRule;
    if (node.type === SlimVMObjectType.AT_RULE) {
      const { name, params } = node as SlimCSSAtRule;
      if (name === "import") {
        sources.push(params);
      }
    }
    for (let i = 0, {length} = grouping.rules; i < length; i++) {
      sources.push(...getNestedSourceUris(grouping.rules[i]));
    }
  }

  if (node.type === SlimVMObjectType.ELEMENT || node.type === SlimVMObjectType.DOCUMENT_FRAGMENT) {
    sources.push(...flatten((node as SlimParentNode).childNodes.map(child => getNestedSourceUris(child))));
  }

  return sources;
});

export const getNestedObjectById = weakMemo((id: string, root: SlimParentNode): VMObject => {
  const ref = flattenObjects(root);
  return ref[id] && ref[id].value;
});

export const flattenObjects = weakMemo((value: VMObject, parentId?: string): FlattenedObjects => {
  return Object.assign({}, ...layoutObjects(value, parentId));
});

const layoutObjects = weakMemo((value: any, parentId: string): FlattenedObjects[] => {

  switch(value.type) {
    case SlimVMObjectType.TEXT: {
      const node = value as SlimTextNode;
      return [
        {
          [node.id]: {
            parentId,
            value
          }
        }
      ]
    }
    case SlimVMObjectType.ELEMENT: {
      const element = value as SlimElement;
      const children = [];
      let base = {
        [element.id]: {
          parentId,
          value
        }
      };

      const style: SlimCSSStyleDeclaration = getAttributeValue("style", element);
      if (style && typeof style === "object") {
        base[style.id] = {
          parentId: element.id,
          value: style,
        };
      }

      if (element.tagName === "style") {
        children.push(...layoutCSSObjects((element as SlimStyleElement).sheet, element.id));
      } else {
        if (element.shadow) {
          children.push(...layoutObjects(element.shadow, element.id));
        }
        children.push(...layoutChildNodes(element.childNodes, element.id));
      }

      children.push(base);
      return children;
    }
    case SlimVMObjectType.DOCUMENT: 
    case SlimVMObjectType.DOCUMENT_FRAGMENT: {
      return [
        {
          [value.id]: { parentId, value }
        },
        ...layoutChildNodes((value as SlimParentNode).childNodes, value.id)
      ]
    }
  }
});

const layoutCSSObjects = weakMemo((value: any, parentId: string): FlattenedObjects[] => {
  const children: FlattenedObjects[] = [];
  switch(value.type) {
    case SlimVMObjectType.AT_RULE:
    case SlimVMObjectType.STYLE_SHEET: {
      const grouping = value as SlimCSSGroupingRule;
      return [
        {
          [grouping.id]: {
            parentId,
            value,
          }
        },
        ...layoutCSSRules(grouping.rules, grouping.id)
      ]
    }
    
    case SlimVMObjectType.STYLE_RULE: {
      const rule = value as SlimCSSStyleRule;
      return [{
        [rule.id]: {
          parentId,
          value,
        },
        [rule.style.id]: {
          parentId: rule.id,
          value: rule.style
        }
      }];
    }
  }
});

const layoutChildNodes = weakMemo((childNodes: SlimBaseNode[], parentId: string) => {
  const children = [];
  for (let i = 0, {length} = childNodes; i < length; i++) {
    children.push(...layoutObjects(childNodes[i], parentId));
  }
  return children;
});

const layoutCSSRules = weakMemo((rules: SlimCSSRule[], parentId: string) => {
  const children = [];
  for (let i = 0, {length} = rules; i < length; i++) {
    children.push(...layoutCSSObjects(rules[i], parentId));
  }
  return children;
});

export const getDocumentChecksum = weakMemo((document: SlimParentNode) => crc32(stringifyNode(document, true)));

export const replaceNestedChild = <TNode extends VMObject>(current: TNode, path: any[], child: SlimBaseNode, index: number = 0): TNode => {
  const part = path[index];
  if (index === path.length) {
    return child as TNode;
  }

  if (part === "shadow") {
    return {
      ...(current as any),
      shadow: replaceNestedChild((current as any).shadow, path, child, index + 1)
    }
  }

  if (part === "sheet") {
    return {
      ...(current as any),
      sheet: replaceNestedChild((current as any as SlimStyleElement).sheet, path, child, index + 1)
    }
  }

  if ((current as any as SlimParentNode).childNodes)  {
    const parentNode = current as any as SlimParentNode;
    return {
      ...(parentNode as any),
      childNodes: [
        ...parentNode.childNodes.slice(0, part),
        replaceNestedChild(parentNode.childNodes[part] as SlimParentNode, path, child, index + 1),
        ...parentNode.childNodes.slice(part + 1)
      ]  
    }
  } else if ((current as any as SlimCSSGroupingRule).rules) {
    const parentRule = current as any as SlimCSSGroupingRule;
    return {
      ...(parentRule as any),
      rules: [
        ...parentRule.rules.slice(0, part),
        replaceNestedChild(parentRule.rules[part] as SlimParentNode, path, child, index + 1),
        ...parentRule.rules.slice(part + 1)
      ]  
    }
  }
};

export const setTextNodeValue = (target: SlimTextNode, newValue: string): SlimTextNode => ({
  ...target,
  value: newValue
});

export const setElementAttribute = (target: SlimElement, name: string, value: string, index?: number): SlimElement => {
  let attributes: SlimElementAttribute[] = [];
  let foundIndex: number = -1;
  for (let i = 0, {length} = target.attributes; i < length; i++) {
    const attribute = target.attributes[i];
    if (attribute.name === name) {
      foundIndex = i;
      if (value) {
        attributes.push({ name, value });
      }
    } else {
      attributes.push(attribute);
    }
  }

  if (foundIndex === -1) {
    foundIndex = attributes.length;
    attributes.push({ name, value });
  }

  if (index != null && foundIndex !== index) {
    const attribute = attributes[foundIndex];
    attributes.splice(foundIndex, 1);
    attributes.splice(index, 0, attribute);
  }

  
  return {
    ...target,
    attributes,
  };
};

export const getSyntheticWindowChild = weakMemo((nodeId: string, window: SlimWindow) => {
  return getNestedObjectById(nodeId, window.document);
});

export const getHostDocument = weakMemo((node: SlimBaseNode, root: SlimParentNode): SlimParentNode => {
  let p = node;

  // return shadow root since :host selector may be applied
  if ((p as SlimElement).shadow) {
    return (p as SlimElement).shadow;
  }

  const allObjects = flattenObjects(root);
  
  while(p && p.type !== SlimVMObjectType.DOCUMENT && p.type !== SlimVMObjectType.DOCUMENT_FRAGMENT) {
    const info = allObjects[p.id];
    p = info && info.parentId && allObjects[info.parentId].value;
  }

  return p as SlimParentNode || root;
});

const getDocumentStyleSheets = weakMemo((document: SlimParentNode) => {
  const allObjects = flattenObjects(document);
  const styleSheets: SlimCSSStyleSheet[] = [];
  for (const key in allObjects) {
    const { value } = allObjects[key];
    if (value.type === SlimVMObjectType.STYLE_SHEET) {
      styleSheets.push(value as SlimCSSStyleSheet);
    }
  }
  return styleSheets;
});

const getDocumentCSSRules = weakMemo((document: SlimParentNode) => {
  const allRules: (SlimCSSStyleRule|SlimCSSAtRule)[] = [];
  const styleSheets = getDocumentStyleSheets(document);
  for (const styleSheet of styleSheets) {
    for (const rule of styleSheet.rules) {
      if (rule.type === SlimVMObjectType.STYLE_RULE || rule.type == SlimVMObjectType.AT_RULE) {
        allRules.push(rule as SlimCSSStyleRule);
      }
    }
  }
  return allRules;
});

export type CSSRuleMatchResult = {
  assocId: string;
  style: SlimCSSStyleDeclaration;
  rule?: SlimCSSStyleRule;
  targetElement: SlimElement;
  mediaRule?: SlimCSSAtRule;
};

// TODO - media query information here
export type AppliedCSSRuleResult = {

  inherited?: boolean;

  rule: CSSRuleMatchResult;

  media?: string;

  // property rules that are 
  ignoredPropertyNames?: {
    [identifier: string]: boolean
  }

  // properties overridden by a style rule with a higher priority
  overriddenPropertyNames?: {
    [identifier: string]: boolean
  }
};

export const isMediaRule = (rule: SlimCSSRule) => rule.type == SlimVMObjectType.AT_RULE && (rule as SlimCSSAtRule).name === "media";

export const getSyntheticMatchingCSSRules = weakMemo((window: SlimWindow, elementId: string, breakPastHost?: boolean) => {
  const element = getSyntheticWindowChild(elementId, window) as any as SlimElement;
  const hostDocument = getHostDocument(element, window.document);
  const allRules = getDocumentCSSRules(hostDocument);
  
  const matchingRules: CSSRuleMatchResult[] = [];

  const elementStyle = getAttribute("style", element);

  for (let i = 0, n = allRules.length; i < n; i++) {
    const rule = allRules[i];

    // no parent rule -- check
    if (rule.type === SlimVMObjectType.STYLE_RULE) {
      if (elementMatches((rule as SlimCSSStyleRule).selectorText, element)) {
        matchingRules.push({
          assocId: rule.id,
          style: (rule as SlimCSSStyleRule).style,
          rule: (rule as SlimCSSStyleRule),
          targetElement: element
        });
      }
    // else - check if media rule
    } else if ((isMediaRule(rule) && createMediaMatcher(window)((rule as any as SlimCSSAtRule).params))) {
      const grouping = rule as SlimCSSGroupingRule;
      for (const childRule of grouping.rules) {
        if (elementMatches((childRule as SlimCSSStyleRule).selectorText, element)) {
          matchingRules.push({
            assocId: childRule.id,
            style: (childRule as SlimCSSStyleRule).style,
            rule: (childRule as SlimCSSStyleRule),
            mediaRule: rule as SlimCSSAtRule,
            targetElement: element
          });
        }
      }
    }
  }

  if (elementStyle) {
    matchingRules.push({
      assocId: element.id,
      targetElement: element,
      style: typeof elementStyle.value === "string" ? parseStyle(elementStyle.value) : elementStyle.value
    });
  }

  return matchingRules;
});

const getSyntheticInheritableCSSRules = weakMemo((window: SlimWindow, elementId: string) => {
  const matchingCSSRules = getSyntheticMatchingCSSRules(window, elementId, true);
  
  const inheritableCSSRules: CSSRuleMatchResult[] = [];

  for (let i = 0, n = matchingCSSRules.length; i < n; i++) {
    const rule = matchingCSSRules[i];
    if (containsInheritableStyleProperty(rule.style)) {
      inheritableCSSRules.push(rule);
    }
  }

  return inheritableCSSRules;
});

export const containsInheritableStyleProperty = (style: SlimCSSStyleDeclaration) => {
  for (const propertyName in style) {
    if (INHERITED_CSS_STYLE_PROPERTIES[propertyName] && style[propertyName]) {
      return true;
    }
  }
  return false;
};

export const getSyntheticAppliedCSSRules = weakMemo((window: SlimWindow, elementId: string) => {
  const element = getSyntheticWindowChild(elementId, window) as any as SlimElement;
  const document = getHostDocument(element, window.document);
  const allRules = getDocumentCSSRules(document);

  // first grab the rules that are applied directly to the element
  const matchingRules = getSyntheticMatchingCSSRules(window, elementId);

  const appliedPropertNames = {};
  const appliedStyleRules = {};

  const appliedRules: AppliedCSSRuleResult[] = [];

  for (let i = matchingRules.length; i--;) {
    const matchingRule = matchingRules[i];

    appliedStyleRules[matchingRule.assocId] = true;

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
  const ancestors = getNodeAncestors(element, window.document);

  // reduce by 1 to omit #document
  for (let i = 0, n = ancestors.length - 1; i < n; i++) {
    const ancestor = ancestors[i];
    if (ancestor.type !== SlimVMObjectType.ELEMENT) {
      continue;
    }
    const inheritedRules = getSyntheticInheritableCSSRules(window, ancestor.id);

    for (let j = inheritedRules.length; j--;) {
      const ancestorRule = inheritedRules[j];
      
      if (appliedStyleRules[ancestorRule.assocId]) {
        continue;
      }
      
      appliedStyleRules[ancestorRule.assocId] = true;

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

export type TargetSelector = {
  uri: string;
  value: string;
}

const getTargetStyleOwners = (element: SlimElement, propertyNames: string[], targetSelectors: TargetSelector[], window: SlimWindow): {
  [identifier: string]: SlimElement | SlimCSSStyleRule
} => {

  // find all applied rules
  const styleOwners = getSyntheticAppliedCSSRules(window, element.id).map(({ rule }) => rule.rule || rule.targetElement);

  // cascade down style rule list until targets are found (defined in css inspector)
  let matchingStyleOwners  = styleOwners.filter((rule) => Boolean(targetSelectors.find(({uri, value}) => {
    return rule.source.uri === uri && rule["selectorText"] == value;
  })));

  if (!matchingStyleOwners.length) {
    matchingStyleOwners = [styleOwners[0]];
  }

  const ret = {};
  for (const propName of propertyNames) {
    ret[propName] = matchingStyleOwners.find((owner) => Boolean(owner.type === SlimVMObjectType.ELEMENT ? (getAttribute("style", owner as SlimElement) || {})[propName] && owner : (owner as SlimCSSStyleRule).style[propName] && owner) || Boolean(matchingStyleOwners[0]))
  }

  return ret;
};

export const cssPropNameToKebabCase = (propName: string) => {
  propName = propName.substr(0, 2) === "--" ? propName : kebabCase(propName);

  // vendor prefix
  if (/^(webkit|moz|ms|o)-/.test(propName)) {
    propName = "-" + propName;
  }

  return propName;
}

export const getElementLabel = (element: SlimElement) => {
  let label = String(element.tagName).toLowerCase();
  const className = getAttributeValue("class", element);
  const id = getAttributeValue("id", element);

  if (id) {
    label += "#" + id;
  } else if (className) {
    label += "." + className;
  }

  return label;
}

/**
 * exists so that other parts of an application can hold onto a reference to a vm object
 */

// TODO - probably better to use something like updateNested
export const setVMObjectIds = <TObject extends VMObject>(current: TObject, idSeed: string, refCount: number = 0) => {

  switch(current.type) {
    case SlimVMObjectType.ELEMENT: {
      let el = current as any as SlimElement;
      if (el.shadow) {
        el = {
          ...el,
          shadow: setVMObjectIds(el.shadow, idSeed, refCount)
        } as SlimElement;
        refCount = getRefCount(el.shadow, idSeed);
      }


      if ((el as SlimStyleElement).sheet) {
        el = {
          ...el,
          sheet: setVMObjectIds((el as SlimStyleElement).sheet, idSeed, refCount)
        } as SlimStyleElement;
        refCount = getRefCount((el as SlimStyleElement).sheet, idSeed);
      }
      
      current = el as any as TObject;
      // fall through
    }

    case SlimVMObjectType.DOCUMENT_FRAGMENT:
    case SlimVMObjectType.DOCUMENT: {
      let parent = current as any as SlimParentNode;

      const newChildren = new Array(parent.childNodes.length);

      for (let i = 0, {length} = parent.childNodes; i < length; i++) {
        const child = setVMObjectIds(parent.childNodes[i], idSeed, refCount);
        refCount = getRefCount(child, idSeed);
        newChildren[i] = child;
      }

      parent = {
        ...parent,
        childNodes: newChildren
      };

      current = parent as any as TObject;

      break;
    }

    case SlimVMObjectType.STYLE_RULE: {
      let styleRule = current as any as SlimCSSStyleRule;
      styleRule = {
        ...styleRule,
        style: setVMObjectIds(styleRule.style, idSeed, refCount)
      } as SlimCSSStyleRule;
      refCount = getRefCount(styleRule.style, idSeed);
      current = styleRule as any as TObject;
      break;
    }

    case SlimVMObjectType.AT_RULE: 
    case SlimVMObjectType.STYLE_SHEET: {
      let groupingRule = current as any as SlimCSSGroupingRule;
      const newRules = new Array(groupingRule.rules.length);
      for (let i = 0, {length} = groupingRule.rules; i < length; i++) {
        const rule = setVMObjectIds(groupingRule.rules[i], idSeed, refCount);
        refCount = getRefCount(rule, idSeed);
        newRules[i] = rule;
      }

      groupingRule = {
        ...groupingRule,
        rules: newRules
      };

      current = groupingRule as any as TObject;
      break;
    }
  }

  return {
    ...(current as any),
    id: idSeed + (refCount + 1)
  };
}

export const getRefCount = (current: VMObject, idSeed: string) => Number((current.id as String).substr(idSeed.length));

export const traverseSlimNode = (current: VMObject, each: (child: VMObject) => void|boolean) => {
  if (each(current) === false)  {
    return false;
  }
  switch(current.type) {
    case SlimVMObjectType.ELEMENT: 
    case SlimVMObjectType.DOCUMENT_FRAGMENT: {
      const parent = current as SlimParentNode;
      for (let i = 0, {length} = parent.childNodes; i < length; i++) {
        if (traverseSlimNode(parent.childNodes[i], each) === false) {
          return false;
        }
      }
    }
  }
}
export const compileScopedCSS = (selectorText: string, scopeClass: string, aliases: any = {}) => {
  const parts = selectorText.match(/.*?([,\s]+|$)/g) || [selectorText];

  return parts.map((part, i) => {
    if (!part) return part;
    let [match, selector, delim] = part.match(/(.*?)([,\s]+)/) || [part, part, ""];
    selector = getScopedSelector(selector, scopeClass, aliases, i);
    return `${selector}${delim}`;
  }).join("");
};

const getScopedSelector = (part: string, scopeClass: string, aliases: any, i: number) => {
  if (/%/.test(part)) return part;

  // TODO - this is all nasty. Need to parse selector as AST, then transform
  // that.

  // ignore ".selector > .selector"
  if (/^[>,]$/.test(part)) return part;

  for (const alias in aliases) {
    if (part.indexOf(alias) !== -1) {
      // console.log(`.${scopeClass}.host > ${part.replace(alias, aliases[alias])}`);
      return `.${scopeClass}_host > ${part.replace(alias, aliases[alias] + "_host")}`;
    }
  }
  const [pseudo] = part.match(/::.*/) || [""];
  part = part.replace(pseudo, "");

  if (part.indexOf(":host") !== -1) {
    let [match, params] = part.match(/\:host\((.*?)\)/) || [null, ""];

    params = params.replace(/\[([\w\d\-]+)\]/g, "[data-$1]");
    // for (const prop of componentProps) {
    //   params = params.replace(prop, "data-" + prop);
    // }

    return part.replace(/\:host(\(.*?\))?/g, `.${scopeClass}_host` + (params ? params : ""));
  }

  // don't want to target spans since the host is one
  if (part === "span" && i === 0) {
    return `.${scopeClass}_host span.${scopeClass}`;
  }

  const addedClass = `.${scopeClass}`;

  // part first in case the selector is a tag name
  // TODO - consider psuedo selectors
  return part + addedClass + pseudo;
}

export const getSlot = weakMemo((slotName: string, parent: SlimElement) => {

  if (!parent.shadow) {
    return null;
  }

  let foundSlot: SlimElement;

  traverseSlimNode(parent.shadow, (nestedChild) => {
    if (nestedChild.type === SlimVMObjectType.ELEMENT) {
      const element = nestedChild as SlimElement;
      if (element.tagName === "slot" && getAttributeValue("name", element) == slotName) {
        foundSlot = element;
        return false;
      }
    }
  });
  
  return foundSlot;
});

export const getSlotChildren = (slot: SlimElement, parent: SlimElement) => {
  return getSlotChildrenByName(getAttributeValue("name", slot), parent)
};

export const getSlotChildrenByName = weakMemo((slotName: string, parent: SlimElement) => {
  return parent.childNodes.filter(child => getNodeSlotName(child) == slotName);
});

export const getNodeSlotName = (node: SlimBaseNode) => node.type === SlimVMObjectType.ELEMENT ? getAttributeValue("slot", node as SlimElement) : null;