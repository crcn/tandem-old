import { SlimParentNode, SlimBaseNode, SlimVMObjectType, SlimElement, SlimTextNode, VMObject, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSGroupingRule, SlimCSSMediaRule, SlimCSSRule, SlimCSSStyleSheet, VMObjectSource, SlimStyleElement } from "./state";

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

export const stringifyNode = weakMemo((node: SlimBaseNode) => {
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
      for (let i = 0, {length} = el.childNodes; i < length; i++) {
        buffer += stringifyNode(el.childNodes[i]);
      }
      buffer += `</${el.tagName}>`;
      return buffer;
    }
    case SlimVMObjectType.DOCUMENT_FRAGMENT: 
    case SlimVMObjectType.DOCUMENT: {
      const el = node as SlimParentNode;
      let buffer = ``;
      for (let i = 0, {length} = el.childNodes; i < length; i++) {
        buffer += stringifyNode(el.childNodes[i]);
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

export const getNodeAncestor = weakMemo((value: SlimBaseNode, root: SlimParentNode): SlimParentNode[] => {
  const objects = flattenObjects(root);
  let current = objects[objects[value.id].parentId];
  let ancestors: SlimParentNode[] = [];

  while(current) {
    ancestors.push(current as any as SlimParentNode);
    current = objects[current.parentId];
  }

  return ancestors;
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
          Object.assign(base, flattenObjects(element.shadow));
        }
        Object.assign(base, flattenChildNodes(element));
      }
      return base;
    }
    case SlimVMObjectType.DOCUMENT: 
    case SlimVMObjectType.DOCUMENT_FRAGMENT: {
      return flattenChildNodes(value as SlimParentNode);
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