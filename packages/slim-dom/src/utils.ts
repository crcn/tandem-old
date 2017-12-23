import { SlimParentNode, SlimBaseNode, SlimVMObjectType, SlimElement, SlimTextNode, VMObject, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSGroupingRule, SlimCSSMediaRule, SlimCSSRule, SlimCSSStyleSheet, VMObjectSource, SlimStyleElement, SlimElementAttribute } from "./state";
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

export type FlattenedObjects = {
  [identifier: string]: {
    parentId: string;
    value: VMObject;
  }
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

export const getNestedObjectById = weakMemo((id: string, root: SlimParentNode): VMObject => {
  const ref = flattenChildNodes(root);
  return ref[id] && ref[id].value;
});

export const flattenObjects = weakMemo((value: VMObject, parentId?: string): FlattenedObjects => {
  switch(value.type) {
    case SlimVMObjectType.TEXT: {
      const node = value as SlimTextNode;
      return {
        [node.id]: {
          parentId,
          value
        }
      };
    }
    case SlimVMObjectType.ELEMENT: {
      const element = value as SlimElement;
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
        Object.assign(base, flattenCSSObjects((element as SlimStyleElement).sheet, element.id));
      } else {
        if (element.shadow) {
          Object.assign(base, flattenObjects(element.shadow, element.id));
        }
        Object.assign(base, flattenChildNodes(element));
      }
      return base;
    }
    case SlimVMObjectType.DOCUMENT: 
    case SlimVMObjectType.DOCUMENT_FRAGMENT: {
      return {
        [value.id]: { parentId: parentId, value },
        ...flattenChildNodes(value as SlimParentNode)
      };
    }
  }
});

const flattenCSSObjects = weakMemo((value: any, parentId: string): FlattenedObjects => {
  switch(value.type) {
    case SlimVMObjectType.MEDIA_RULE:
    case SlimVMObjectType.STYLE_SHEET: {
      const grouping = value as SlimCSSGroupingRule;
      let base = {
        [grouping.id]: {
          parentId,
          value,
        }
      };
      Object.assign(base, flattenCSSRules(grouping));
      return base;
    }
    
    case SlimVMObjectType.STYLE_RULE: {
      const rule = value as SlimCSSStyleRule;
      return {
        [rule.id]: {
          parentId,
          value,
        },
        [rule.style.id]: {
          parentId: rule.id,
          value: rule.style
        }
      };
    }
  }
});

const flattenChildNodes = weakMemo((target: SlimParentNode) => {
  let objects = {};
  for (let i = 0, {length} = target.childNodes; i < length; i++) {
    Object.assign(objects, flattenObjects(target.childNodes[i], target.id));
  }
  return objects;
});

const flattenCSSRules = weakMemo((target: SlimCSSGroupingRule) => {
  let objects = {};
  for (let i = 0, {length} = target.rules; i < length; i++) {
    Object.assign(objects, flattenCSSObjects(target.rules[i], target.id));
  }
  return objects;
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