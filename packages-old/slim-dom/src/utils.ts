import { SlimParentNode, SlimBaseNode, SlimVMObjectType, SlimElement, SlimTextNode, VMObject, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSGroupingRule, SlimCSSAtRule, SlimCSSRule, SlimCSSStyleSheet, VMObjectSource, SlimStyleElement, SlimElementAttribute, SlimWindow, SlimFontFace } from "./state";
import { querySelector, elementMatches } from "./query-selector";
import { createMediaMatcher } from "./media-match";
import { uniq, flatten, kebabCase, camelCase, padStart } from "lodash";
import { INHERITED_CSS_STYLE_PROPERTIES } from "./constants";
import crc32 = require("crc32");
import { weakMemo } from "./weak-memo";
export { weakMemo };

const ID_TYPE_PAD = 2;

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

export const setCSSStyleProperty = <TRule extends SlimCSSStyleRule>(rule: TRule, index: number, name: string, value: string): TRule => {
  const newStyle = [...rule.style];
  const prop = { name, value };
  if (index > newStyle.length) {
    newStyle.push(prop);
  } else {
    newStyle[index] = prop;
  }
  return {
    ...(rule as any),
    style: newStyle
  };
};

export const insertCSSStyleProperty = <TRule extends SlimCSSStyleRule>(rule: TRule, index: number, name: string, value: string): TRule => {
  const newStyle = [...rule.style];
  newStyle.splice(index, 0, { name, value });
  return {
    ...(rule as any),
    style: newStyle
  };
}

export const removeCSSStyleProperty = <TRule extends SlimCSSStyleRule>(rule: TRule, index: number): TRule => {

  const newStyle = [...rule.style];
  newStyle.splice(index, 1);

  return {
    ...(rule as any),
    style: newStyle
  };
};

export const moveCSSStyleProperty = <TRule extends SlimCSSStyleRule>(rule: TRule, oldIndex: number, newIndex: number): TRule => {

  const newStyle = [...rule.style];
  const prop = newStyle[oldIndex];
  newStyle.splice(oldIndex, 1);
  newStyle.splice(newIndex, 0, prop);

  return {
    ...(rule as any),
    style: newStyle
  };
};

export const parseStyle = weakMemo((styleStr: string) => {
  const style = [];
  styleStr.split(";").forEach(part => {
    const [name, ...rest] = part.split(":");
    if (!name) return;
    style.push({
      name: camelCase(name.trim()),
      value: rest.join(":").trim()
    });
  });
  return style;
});

export const stringifyStyle = (style: any) => {
  let buffer = ``;
  if (Array.isArray(style)) {
    for (const {name,value} of style) {
      buffer += `${cssPropNameToKebabCase(name)}: ${value};`
    }
  } else {
    for (const key of style) {
      buffer += `${cssPropNameToKebabCase(key)}: ${style[key]};`
    }
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
      if (el.tagName === "style") {
        buffer += stringifyStyleObject((el as SlimStyleElement).sheet);
      } else {
        for (let i = 0, {length} = el.childNodes; i < length; i++) {
          buffer += stringifyNode(el.childNodes[i], includeShadow);
        }
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

export const stringifyStyleObject = weakMemo((styleObject: SlimCSSRule) => {
  switch(styleObject.type) {
    case SlimVMObjectType.STYLE_SHEET: {
      const sheet = styleObject as SlimCSSStyleSheet;
      return sheet.rules.map(stringifyStyleObject);
    }
    case SlimVMObjectType.STYLE_RULE: {
      const {selectorText, style} = styleObject as SlimCSSStyleRule;
      return `${selectorText} { ${stringifyStyle(style)} }`
    }
    case SlimVMObjectType.AT_RULE: {
      const {name, params, rules} = styleObject as SlimCSSAtRule;
      return `@${name} ${params.trim()} { ${rules.map(stringifyStyleObject)} }`
    }
    case SlimVMObjectType.FONT_FACE_RULE: {
      const {style} = styleObject as SlimFontFace;
      return `@font-face { ${stringifyStyle(style)} }`
    }
    default: {
      console.error(`cannot stringify `, styleObject);
      // throw new Error(`Cannot stringify style rule type ${styleObject.type}.`);
    }
  }
});

export const getAttribute = (name: string, element: SlimElement) => {
  const {attributes} = element;
  for (let i = attributes.length; i--;) {
    const attribute = attributes[i];
    if (attribute.name === name) {
      return attribute;
    }
  }
  return null;
}

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

export const getNodeAncestors = weakMemo((value: SlimBaseNode, root: SlimParentNode, followSlots: boolean = false): SlimParentNode[] => {
  const objects = flattenObjects(root);
  let child = objects[value.id];
  let parent = objects[child.parentId];
  let ancestors: SlimParentNode[] = [];

  let i = 0;
  while(parent) {
    
    if (followSlots && (parent.value as SlimElement).shadow) {
      const parentElement = parent.value as SlimElement;
      const slot = getSlot(getNodeSlotName(child.value), parentElement);
      if (slot) {
        ancestors.push(...getNodeAncestors(slot, parentElement.shadow));
      }
    }

    ancestors.push(parent.value as any as SlimParentNode);
    if (!parent.parentId) {
      break;
    }
    child  = parent;
    parent = objects[parent.parentId];

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
export const getVMObjectFromPath = weakMemo((path: any[], root: VMObject): VMObject => {
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
});

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

export const getStyleOwnerScopeInfo = (ownerId: string, root: SlimParentNode): any[] => {
  const owner = getNestedObjectById(ownerId, root);
  const path = getVMObjectPath(owner, root);
  if (owner.type === SlimVMObjectType.STYLE_RULE) {
    const styleElement = getSheetStyleElement(path, root);
    return [
      owner.type,
      (owner as SlimCSSStyleRule).selectorText,
      getAttributeValue("scope", styleElement),
      ...path.slice(path.indexOf("sheet"))
    ];
  } else {
    console.log(owner);
    console.error(`Not implemented yet`);
    return [];
  }
};

export const getStyleOwnerFromScopeInfo = ([type, ...rest]: any[], window: SlimWindow): SlimCSSStyleRule|SlimElement => {
  if (type === SlimVMObjectType.STYLE_RULE) {
    const [selectorText, scope, ...relPath] = rest;
    const styleElements = getScopedStyleElements(scope, window);
    for (const styleElement of styleElements) {
      const absPath = [...getVMObjectPath(styleElement, window.document), ...relPath];
      const owner = getVMObjectFromPath(absPath, window.document) as SlimCSSStyleRule;
      if (owner && owner.type === type && owner.selectorText === selectorText) {
        return owner as SlimCSSStyleRule;
      }
    }
  }
};

const getSheetStyleElement = (path: string[], root: SlimParentNode) => {
  const index = path.indexOf("sheet");
  return index > -1 ? getVMObjectFromPath(path.slice(0, index), root) as SlimStyleElement : null;
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

export const setElementAttributeAt = (target: SlimElement, index: number, name: string, value) => {
  let attributes: SlimElementAttribute[] = [...target.attributes];
  attributes[index] = { name, value };
  return {
    ...target,
    attributes
  } as SlimElement;
}

export const removeElementAttributeAt = (target: SlimElement, index: number) => {
  let attributes: SlimElementAttribute[] = [...target.attributes];
  attributes.splice(index, 1);
  return {
    ...target,
    attributes
  } as SlimElement;
};

export const insertElementAttributeAt = (target: SlimElement, index: number, name: string, value: string) => {
  let attributes: SlimElementAttribute[] = [...target.attributes];
  attributes.splice(index, 0, { name, value });
  return {
    ...target,
    attributes
  } as SlimElement;
}

export const moveElementAttribute = (target: SlimElement, index: number, newIndex: number) => {
  const { name, value } = target.attributes[index];
  target = removeElementAttributeAt(target, index);
  return insertElementAttributeAt(target, newIndex, name, value);
};


export const getSyntheticWindowChild = weakMemo((nodeId: string, window: SlimWindow) => {
  return getNestedObjectById(nodeId, window.document);
});


export const getSlimNodeHost = weakMemo((node: SlimBaseNode, root: SlimParentNode): SlimElement => {
  const path = getVMObjectPath(node, root);
  const shadowIndex = path.lastIndexOf("shadow");
  return shadowIndex > -1 ? getVMObjectFromPath(path.slice(0, shadowIndex), root) as SlimElement : null;
});

const getDocumentStyleSheets = weakMemo((document: SlimParentNode) => {
  const allObjects = flattenObjects(document);
  const styleSheets: SlimCSSStyleSheet[] = [];
  for (const key in allObjects) {
    const { value } = allObjects[key];
    if (value.type === SlimVMObjectType.ELEMENT && (value as SlimElement).tagName === "style" && !getAttributeValue("scope", (value as SlimElement))) {
      styleSheets.push((value as SlimStyleElement).sheet);
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
  pseudo?: string;
  style: SlimCSSStyleDeclaration;
  rule?: SlimCSSStyleRule;
  targetElement?: SlimElement;
  mediaRule?: SlimCSSAtRule;
};

// TODO - media query information here
export type AppliedCSSRuleResult = {

  inherited?: boolean;

  rule: CSSRuleMatchResult;

  media?: string;

  disabledPropertyNames?: {
    [identifier: string]: boolean
  };

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

export const getScopedStyleRules = weakMemo((tagName: string, window: SlimWindow) => {
  const allVMObjects = flattenObjects(window.document);
  const scopedRules: (SlimCSSStyleRule|SlimCSSAtRule)[] = [];
  const scopedStyleElements = getScopedStyleElements(tagName, window);
  for (const styleElement of scopedStyleElements) {
    for (const rule of styleElement.sheet.rules) {
      if (rule.type === SlimVMObjectType.STYLE_RULE || rule.type == SlimVMObjectType.AT_RULE) {
        scopedRules.push(rule as SlimCSSStyleRule);
      }
    }
  }
  return scopedRules;
});

export const getScopedStyleElements = weakMemo((tagName: string, window: SlimWindow) => {
  const allVMObjects = flattenObjects(window.document);
  const elements: SlimStyleElement[] = [];
  for (const id in allVMObjects) {
    const { value } = allVMObjects[id];
    if (value.type === SlimVMObjectType.ELEMENT && (value as SlimElement).tagName === "style" && getAttributeValue("scope", value as SlimElement) == tagName) {
      elements.push(value as SlimStyleElement);  
    }
  }
  return elements;
});

const getNodeCSSRules = weakMemo((node: SlimBaseNode, window: SlimWindow) => {
  const host = getSlimNodeHost(node, window.document);
  let allRules = getDocumentCSSRules(window.document);
  if (host) {
    allRules = [...getScopedStyleRules(host.tagName, window), ...allRules];
  }

  // if shadow exists, then the element may have scoped styles
  if (node.type === SlimVMObjectType.ELEMENT && (node as SlimElement).shadow) {
    allRules = [...allRules, ...getScopedStyleRules((node as SlimElement).tagName, window)]
  }

  return allRules;
});

export const getPseudoElementName = (selector: string): string => {
  const match = selector.match(/::?(before|after|placeholder)/);
  return match ? match[1] : null;
}

export const getSyntheticMatchingCSSRules = weakMemo((window: SlimWindow, elementId: string, breakPastHost?: boolean) => {
  const element = getSyntheticWindowChild(elementId, window) as any as SlimElement;
  const allRules = getNodeCSSRules(element, window);
  
  const matchingRules: CSSRuleMatchResult[] = [];

  const elementStyle = getAttribute("style", element);

  for (let i = 0, n = allRules.length; i < n; i++) {
    const rule = allRules[i];

    // no parent rule -- check
    if (rule.type === SlimVMObjectType.STYLE_RULE) {
      if (elementMatches((rule as SlimCSSStyleRule).selectorText, element, window.document)) {
        const styleRule = (rule as SlimCSSStyleRule);

        matchingRules.push({
          assocId: rule.id,
          pseudo: getPseudoElementName(styleRule.selectorText),
          style: styleRule.style,
          rule: styleRule,
          targetElement: element
        });
      }
    // else - check if media rule
    } else if ((isMediaRule(rule) && createMediaMatcher(window)((rule as any as SlimCSSAtRule).params))) {
      const grouping = rule as SlimCSSGroupingRule;
      for (const childRule of grouping.rules) {
        if (elementMatches((childRule as SlimCSSStyleRule).selectorText, element, window.document)) {
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

export const  containsInheritableStyleProperty = (style: SlimCSSStyleDeclaration) => {
  for (const {name, value} of style) {
    if (INHERITED_CSS_STYLE_PROPERTIES[name] && value) {
      return true;
    }
  }
  return false;
};

const getDisabledDeclarations = (matchingRule: CSSRuleMatchResult, window: SlimWindow, disabledDeclarationInfo: any = {}) => {
  const ruleOwner = matchingRule.rule || matchingRule.targetElement;
  return getDisabledStyleRuleProperties(ruleOwner.id, window.document, disabledDeclarationInfo);
}

export const isCSSPropertyDisabled = (itemId: string, propertyName: string, document: SlimParentNode, disabledDeclarationInfo: any = {}) => {
  return Boolean(getDisabledStyleRuleProperties(itemId, document, disabledDeclarationInfo)[propertyName]);
};

export const getDisabledStyleRuleProperties = (itemId: string, document: SlimParentNode, disabledDeclarationInfo: any) => {
  const scopeInfo = getStyleOwnerScopeInfo(itemId, document);
  const scopeHash = scopeInfo.join("");

  const disabledPropertyNames = {}
  const info =  disabledDeclarationInfo[scopeHash] || {};

  for (const key in info) {
    disabledPropertyNames[key] = Boolean(info[key]);
  }
  return disabledPropertyNames;
};



export const getSyntheticAppliedCSSRules = weakMemo((window: SlimWindow, elementId: string, disabledDeclarationInfo: any = {}) => {
  const element = getSyntheticWindowChild(elementId, window) as any as SlimElement;
  const allRules = getNodeCSSRules(element, window);

  // first grab the rules that are applied directly to the element
  const matchingRules = getSyntheticMatchingCSSRules(window, elementId);

  const appliedPropertNames = {};
  const appliedStyleRules = {};

  const appliedRules: AppliedCSSRuleResult[] = [];

  for (let i = matchingRules.length; i--;) {
    const matchingRule = matchingRules[i];
    const pseudo =  matchingRule.pseudo;

    const disabledPropertyNames = getDisabledDeclarations(matchingRule, window, disabledDeclarationInfo);
    appliedStyleRules[matchingRule.assocId] = true;

    const overriddenPropertyNames = {};;

    for (const {name: propertyName} of matchingRule.style) {
      if (appliedPropertNames[pseudo + propertyName]) {
        overriddenPropertyNames[propertyName] = true;
      } else if(!disabledPropertyNames[propertyName]) {
        appliedPropertNames[pseudo + propertyName] = true;
      }
    }

    appliedRules.push({
      inherited: false,
      rule: matchingRule,
      overriddenPropertyNames,
      disabledPropertyNames,
    });
  }

  // next, fetch the style rules that have inheritable properties such as font-size, color, etc. 
  const ancestors = getNodeAncestors(element, window.document, true);

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
      const pseudo = ancestorRule.pseudo;

      const disabledPropertyNames = getDisabledDeclarations(ancestorRule, window, disabledDeclarationInfo);
      
      appliedStyleRules[ancestorRule.assocId] = true;

      const overriddenPropertyNames = {};
      const ignoredPropertyNames   = {};
      for (const {name: propertyName} of ancestorRule.style) {
        if (!INHERITED_CSS_STYLE_PROPERTIES[propertyName]) {
          ignoredPropertyNames[propertyName] = true;
        } else if (appliedPropertNames[pseudo + propertyName]) {
          overriddenPropertyNames[propertyName] = true;
        } else if(!disabledPropertyNames[propertyName]) {
          appliedPropertNames[pseudo + propertyName] = true;
        }
      }

      appliedRules.push({
        inherited: true,
        rule: ancestorRule,
        ignoredPropertyNames,
        disabledPropertyNames,
        overriddenPropertyNames,
      });
    }
  }

  const rootStyleRule = getRootStyleRule(window);

  if (rootStyleRule) {
    const matchingCSSRules = {
      assocId: rootStyleRule.id,
      style: rootStyleRule.style,
      rule: rootStyleRule,
    };
    appliedRules.push({
      inherited: true,
      rule: matchingCSSRules,
      ignoredPropertyNames: {},
      overriddenPropertyNames: {},
      disabledPropertyNames: getDisabledDeclarations(matchingCSSRules, window, disabledDeclarationInfo)
    })
  }

  return appliedRules;
});

export type TargetSelector = {
  uri: string;
  value: string;
}


export const getRootStyleRule = weakMemo((window: SlimWindow) => {
  const allObjects = flattenObjects(window.document);
  for (const id in allObjects) {
    const { value } = allObjects[id];
    if (value.type === SlimVMObjectType.STYLE_RULE && (value as SlimCSSStyleRule).selectorText === ":root") {
      return value as SlimCSSStyleRule
    }
  }
});

const getTargetStyleOwners = (element: SlimElement, propertyNames: string[], targetSelectors: TargetSelector[], window: SlimWindow, disabledProperties?: any): {
  [identifier: string]: SlimElement | SlimCSSStyleRule
} => {

  // find all applied rules
  const styleOwners = getSyntheticAppliedCSSRules(window, element.id, disabledProperties).map(({ rule }) => rule.rule || rule.targetElement);

  // cascade down style rule list until targets are found (defined in css inspector)
  let matchingStyleOwners  = styleOwners.filter((rule) => Boolean(targetSelectors.find(({uri, value}) => {
    return rule.source.uri === uri && rule["selectorText"] == value;
  })));

  if (!matchingStyleOwners.length) {
    matchingStyleOwners = [styleOwners[0]];
  }

  const ret = {};
  for (const propName of propertyNames) {
    ret[propName] = matchingStyleOwners.find((owner) => Boolean(owner.type === SlimVMObjectType.ELEMENT ? getStyleValue(propName, getAttribute("style", owner as SlimElement) as any || []) && owner : getStyleValue(propName, (owner as SlimCSSStyleRule).style) && owner) || Boolean(matchingStyleOwners[0]))
  }

  return ret;
};

export const getStyleValue = (name: string, style: SlimCSSStyleDeclaration) => {
  for (let i = style.length; i--;) {
    const prop = style[i];
    if (prop.name === name) {
      return prop.value;
    }
  }
  return null;
}

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

    // case SlimVMObjectType.STYLE_RULE: {
    //   let styleRule = current as any as SlimCSSStyleRule;
    //   styleRule = {
    //     ...styleRule,
    //     style: setVMObjectIds(styleRule.style, idSeed, refCount)
    //   } as SlimCSSStyleRule;
    //   refCount = getRefCount(styleRule.style, idSeed);
    //   current = styleRule as any as TObject;
    //   break;
    // }

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
  };

  if (current.type == null) {
    throw new Error(`Current type is not defined`);
  }

  return {
    ...(current as any),

    // insert type to allow other parts of app to pull it out (like dom renderer)
    id: padStart(String(current.type), ID_TYPE_PAD, "0") + idSeed + (refCount + 1)
  };
}

export const getVMObjectIdType = (id: string) => Number(id.substr(0, ID_TYPE_PAD));

export const getRefCount = (current: VMObject, idSeed: string) => {
  return Number((current.id as String).substr(idSeed.length + ID_TYPE_PAD));
}

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

  const scopeHostClass = scopeClass + `_host`;

  // TODO - this is all nasty. Need to parse selector as AST, then transform
  // that.

  for (const alias in aliases) {
    if (part.indexOf(alias) !== -1) {
      part = part.replace(part, part.replace(alias, aliases[alias] + "_host"));
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

    return part.replace(/\:host(\(.*?\))?/g, `.${scopeHostClass}` + (params ? params : ""));
  }

  // don't want to target spans since the host is one
  if (part === "span" && i === 0) {
    return `.${scopeHostClass} span.${scopeClass}`;
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

export const isValidStyleDeclarationName = (name: string) => !/^([\$_]|\d+$)/.test(name.charAt(0)) && !/^(type|id)$/.test(name);