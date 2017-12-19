import { ParentNode, BaseNode, NodeType, Element, TextNode, VMObject, CSSStyleDeclaration, CSSStyleRule, CSSRuleType, CSSGroupingRule, CSSMediaRule, CSSRule, CSSStyleSheet, VMObjectSource, StyleElement } from "./state";

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

export const pushChildNode = <TParent extends ParentNode>(parent: TParent, child: BaseNode): TParent => ({
  ...(parent as any),
  childNodes: [
    ...parent.childNodes,
    child
  ]
});

export const stringifyNode = weakMemo((node: BaseNode) => {
  switch(node.type) {
    case NodeType.TEXT: {
      const text = node as TextNode;
      return text.value;
    }
    case NodeType.ELEMENT: {
      const el = node as Element;
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
    case NodeType.DOCUMENT_FRAGMENT: 
    case NodeType.DOCUMENT: {
      const el = node as ParentNode;
      let buffer = ``;
      for (let i = 0, {length} = el.childNodes; i < length; i++) {
        buffer += stringifyNode(el.childNodes[i]);
      }
      return buffer;
    }
  }
});

export const getAttribute = (name: string, element: Element) => element.attributes.find(attribute => attribute.name === name);

export const hasAttribute = (name: string, element: Element) => {
  return getAttribute(name, element) != null;
};

export const getAttributeValue = (name: string, element: Element) => {
  const attribute = getAttribute(name, element);
  return attribute && attribute.value;
};

export type FlattenedObjects = {
  [identifier: string]: {
    parentId: string;
    value: VMObject;
  }
};

export const getNodeAncestor = weakMemo((value: BaseNode, root: ParentNode): ParentNode[] => {
  const objects = flattenObjects(root);
  let current = objects[objects[value.id].parentId];
  let ancestors: ParentNode[] = [];

  while(current) {
    ancestors.push(current as any as ParentNode);
    current = objects[current.parentId];
  }

  return ancestors;
});

export const getNestedObjectById = weakMemo((id: string, root: ParentNode): VMObject => {
  const ref = flattenChildNodes(root);
  return ref[id] && ref[id].value;
});

export const flattenObjects = weakMemo((value: VMObject, parentId?: string): FlattenedObjects => {
  switch(value.type) {
    case NodeType.TEXT: {
      const node = value as TextNode;
      return {
        [node.id]: {
          parentId,
          value
        }
      };
    }
    case NodeType.ELEMENT: {
      const element = value as Element;
      let base = {
        [element.id]: {
          parentId,
          value
        }
      };

      const style: CSSStyleDeclaration = getAttributeValue("style", element);
      if (style && typeof style === "object") {
        base[style.id] = {
          parentId: element.id,
          value: style,
        };
      }

      if (element.tagName === "style") {
        Object.assign(base, flattenCSSObjects((element as StyleElement).sheet, element.id));
      } else {
        if (element.shadow) {
          Object.assign(base, flattenObjects(element.shadow));
        }
        Object.assign(base, flattenChildNodes(element));
      }
      return base;
    }
    case NodeType.DOCUMENT: 
    case NodeType.DOCUMENT_FRAGMENT: {
      return flattenChildNodes(value as ParentNode);
    }
  }
});

const flattenCSSObjects = weakMemo((value: any, parentId: string): FlattenedObjects => {
  switch(value.type) {
    case CSSRuleType.MEDIA_RULE:
    case CSSRuleType.STYLE_SHEET: {
      const grouping = value as CSSGroupingRule;
      let base = {
        [grouping.id]: {
          parentId,
          value,
        }
      };
      Object.assign(base, flattenCSSRules(grouping));
      return base;
    }
    
    case CSSRuleType.STYLE_RULE: {
      const rule = value as CSSStyleRule;
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

const flattenChildNodes = weakMemo((target: ParentNode) => {
  let objects = {};
  for (let i = 0, {length} = target.childNodes; i < length; i++) {
    Object.assign(objects, flattenObjects(target.childNodes[i], target.id));
  }
  return objects;
});

const flattenCSSRules = weakMemo((target: CSSGroupingRule) => {
  let objects = {};
  for (let i = 0, {length} = target.rules; i < length; i++) {
    Object.assign(objects, flattenCSSObjects(target.rules[i], target.id));
  }
  return objects;
});