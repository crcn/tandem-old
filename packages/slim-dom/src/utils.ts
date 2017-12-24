import { SlimParentNode, SlimBaseNode, SlimVMObjectType, SlimElement, SlimTextNode, VMObject, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSGroupingRule, SlimCSSMediaRule, SlimCSSRule, SlimCSSStyleSheet, VMObjectSource, SlimStyleElement, SlimElementAttribute } from "./state";
import { uniq, flatten } from "lodash";
import crc32 = require("crc32");

let previousPurgeTime = 0;
const DUMP_DEFAULT_ANCHOR_INTERVAL = 1000 * 60 * 5;
let DEFAULT_ANCHOR: any = {};

export function weakMemo<TFunc extends (...args: any[]) => any>(func: TFunc, mapMemo: (value?: any) => any = (value => value)): TFunc {
  let count = 1;
  const memoKey = Symbol();
  const hashKey = Symbol();
  return function() {
    if (previousPurgeTime && Date.now() - DUMP_DEFAULT_ANCHOR_INTERVAL > previousPurgeTime) {
      previousPurgeTime = Date.now();
      DEFAULT_ANCHOR = {};
    }
    let hash = "";
    let anchor: any = DEFAULT_ANCHOR;

    for (let i = 0, n = arguments.length; i < n; i++) {
      const arg = arguments[i];

      let hashPart;

      if (arg && typeof arg === "object") {
        anchor = arg;
        hashPart = arg[hashKey] && arg[hashKey].self === arg ? arg[hashKey].value : (arg[hashKey] = { self: arg, value: ":" + (count++) }).value;
      } else {
        hashPart = ":" + arg;
      }

      hash += hashPart;
    }

    if (!anchor[memoKey] || anchor[memoKey].self !== anchor) anchor[memoKey] = { self: anchor };
    return mapMemo(anchor[memoKey].hasOwnProperty(hash) ? anchor[memoKey][hash] : anchor[memoKey][hash] = func.apply(this, arguments));

  } as any as TFunc;
};

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

export const getNodeAncestors = weakMemo((value: SlimBaseNode, root: SlimParentNode): SlimParentNode[] => {
  const objects = flattenObjects(root);
  let current = objects[objects[value.id].parentId];
  let ancestors: SlimParentNode[] = [];

  while(current) {
    ancestors.push(current.value as any as SlimParentNode);
    current = objects[current.parentId];
  }

  return ancestors;
});

export const getNodePath = weakMemo((value: SlimBaseNode, root: SlimParentNode): any[] => {
  const objects = flattenObjects(root);
  let current = objects[value.id];
  const path: any[] = [];

  while(current && current.parentId) {
    const parentInfo = objects[current.parentId];

    // TODO - check if css rules
    if ((parentInfo.value as SlimElement).shadow === current.value) { 
      path.unshift("shadow");
    } else {
      path.unshift((parentInfo.value as SlimParentNode).childNodes.indexOf(current.value));
    }
    current = parentInfo;
  }

  return path;
});

export const getVmObjectSourceUris = weakMemo((node: SlimBaseNode) => {
  return uniq(getNestedSourceUris(node));
});

const getNestedSourceUris = weakMemo((node: SlimBaseNode): string[] => {
  const sources: string[] = [];
  if (node.source && node.source.uri) {
    sources.push(node.source.uri);
  }
  if (node.type === SlimVMObjectType.ELEMENT) {
    const element = node as SlimElement;
    if (element.shadow) {
      sources.push(...getNestedSourceUris(element.shadow));
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
    case SlimVMObjectType.MEDIA_RULE:
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

export const replaceNestedChild = <TNode extends SlimParentNode>(current: TNode, path: any[], child: SlimBaseNode, index: number = 0): TNode => {
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

  return {
    ...(current as any),
    childNodes: [
      ...current.childNodes.slice(0, part),
      replaceNestedChild(current.childNodes[part] as SlimParentNode, path, child, index + 1),
      ...current.childNodes.slice(part + 1)
    ]  
  } as TNode;
};

export const setTextNodeValue = (target: SlimTextNode, newValue: string): SlimTextNode => ({
  ...target,
  value: newValue
});

export const setElementAttribute = (target: SlimElement, name: string, value: string): SlimElement => {
  let attributes: SlimElementAttribute[] = [];
  let found: boolean;
  for (let i = 0, {length} = target.attributes; i < length; i++) {
    const attribute = target.attributes[i];
    if (attribute.name === name) {
      found = true;
      if (value) {
        attributes.push({ name, value });
      }
    } else {
      attributes.push(attribute);
    }
  }

  if (!found) {
    attributes.push({ name, value });
  }

  return {
    ...target,
    attributes,
  };
}