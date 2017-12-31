import { SlimBaseNode, SlimParentNode, SlimVMObjectType, SlimCSSAtRule, SlimCSSGroupingRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElement, SlimElementAttribute, SlimFragment, SlimStyleElement, SlimTextNode, SlimWindow, VMObjectSource, VMObject } from "./state";
import { patchNode } from "./diff-patch";
import { getAttributeValue, getVMObjectFromPath, compileScopedCSS } from "./utils";
import { DOMNodeMap, ComputedDOMInfo } from "./dom-renderer";
import { Mutation, InsertChildMutation, RemoveChildMutation, SetPropertyMutation, SetValueMutation, MoveChildMutation } from "source-mutation";
import { REMOVE_CHILD_NODE, INSERT_CHILD_NODE, CSS_AT_RULE_SET_PARAMS, CSS_DELETE_RULE, CSS_INSERT_RULE, CSS_MOVE_RULE, CSS_SET_SELECTOR_TEXT, CSS_SET_STYLE_PROPERTY, ATTACH_SHADOW, REMOVE_SHADOW, SET_ATTRIBUTE_VALUE, MOVE_CHILD_NODE, SET_TEXT_NODE_VALUE } from "./diff-patch";

export type DOMMap = {
  [identifier: string]: Node
};

export type CSSOMMap = {
  [identifier: string]: CSSStyleRule|CSSGroupingRule|CSSStyleSheet|CSSKeyframesRule
};

export type NativeObjectMap = {
  dom: DOMMap;
  cssom: CSSOMMap;
}

export const renderDOM2 = (object: VMObject, root: HTMLElement): NativeObjectMap => {
  const domMap: DOMMap = {};
  const cssomMap: CSSOMMap = {};
  root.appendChild(createNativeNode(object, root.ownerDocument, { map: domMap }));
  insertStyleSheets(object as SlimParentNode, root, { map: cssomMap, insertedStyles: {} });
  return { dom: domMap, cssom: cssomMap };
};

type CreateNativeNodeContext = {
  host?: {
    element: SlimElement;
    childNodes: Node[];
  };
  map: DOMMap;
};

type InsertStyleSheetContext = {
  host?: SlimElement;
  insertedStyles: {
    [identifier: string]: boolean
  }
  map: CSSOMMap
};

const createNativeNode = (vmNode: VMObject, document: Document, context: CreateNativeNodeContext): Node => {
  switch(vmNode.type) {
    case SlimVMObjectType.ELEMENT: {
      const { tagName, id, shadow, childNodes, attributes } = vmNode as SlimElement;

      const elementContext = shadow ? { ...context, host: vmNode as SlimElement } : context;

      if (tagName === "slot") {

        // TODO - may need to use anchor text node to ensure that the slot has its place. 
        // Note that document fragment is necessary for slots to ensure that that certain props are inheritable from the parent (like display: flex)
        const slotElement = context.map[id] = document.createDocumentFragment();

        const host = context.host;

        if (host) {
          const slotName = getAttributeValue("name", vmNode as SlimElement);
          for (let i = 0, {length} = host.childNodes; i < length; i++) {
            const child = host.childNodes[i];
            const nativeChildSlotName = child.nodeType === 1 ? (child as Element).getAttribute("slot") : null;

            if (nativeChildSlotName == slotName) {
              slotElement.appendChild(child);
            }
          }
        }

        if (!slotElement.childNodes.length) {
          appendNativeChildNodes(vmNode as SlimParentNode, slotElement, document,  context)
        }

        return  slotElement;
      }

      const nativeElement = context.map[id] = document.createElement(tagName);

      if (tagName === "style") {
        return null;
      }
      
      for (let i = 0, {length} = attributes; i < length; i++) {
        const attribute = attributes[i];
        if (attribute.name === "style" && typeof attribute.value === "object") {
          Object.assign(nativeElement[attribute.name], attribute.value);
        } else if (typeof attribute.value !== "object") {
          nativeElement.setAttribute(attribute.name, attribute.value);
        }
        nativeElement.dataset[attribute.name.toLowerCase()] = "true";
      }
      if (context.host) {
        nativeElement.classList.add(getScopeTagName(context.host.element));
      }
      
      if (shadow) {
        nativeElement.classList.add(getScopeTagName(vmNode as SlimElement) + "_host");
      }


      if (shadow) {
        context.map[shadow.id] = nativeElement;
        const nativeShadow = createNativeNode(shadow, document, {
          ...context,
          host: {
            element: vmNode as SlimElement,
            childNodes: childNodes.map(child => createNativeNode(child, document, context))
          }
        });
        // TODO - get slots
        nativeElement.appendChild(nativeShadow);
      } else {
        appendNativeChildNodes(vmNode as SlimParentNode, nativeElement, document,  context)
      }
      return nativeElement;
    }
    case SlimVMObjectType.TEXT: {
      const textNode = vmNode as SlimTextNode;
      return context.map[textNode.id] = document.createTextNode(textNode.value);
    }
    case SlimVMObjectType.DOCUMENT: 
    case SlimVMObjectType.DOCUMENT_FRAGMENT: {
      const fragment = document.createDocumentFragment();
      appendNativeChildNodes(vmNode as SlimParentNode, fragment, document,  context)
      return fragment;
    }
  }
  return null;
};

const createParentChildNodes = (parent: SlimParentNode, document: Document, context: CreateNativeNodeContext) => {
  parent.childNodes.map(child => createNativeNode(parent, document, context));
}

const insertStyleSheets = (current: VMObject, mount: HTMLElement, context: InsertStyleSheetContext) => {
  if (current.type === SlimVMObjectType.ELEMENT) {
    const element = current as SlimElement;
    if (element.tagName === "style") {
      insertStyleSheet(element as SlimStyleElement, mount, context);
    } else if (element.shadow) {
      insertStyleSheets(element.shadow, mount, {
        ...context,
        host: element
      });
    }
  }
  if ((current as SlimParentNode).childNodes) {
    const parent = current as SlimParentNode;
    for (let i = 0, {length} = parent.childNodes; i < length; i++) {
      insertStyleSheets(parent.childNodes[i], mount, context);
    }
  }
};

const insertStyleSheet = (element: SlimStyleElement, mount: HTMLElement, context: InsertStyleSheetContext) => {
  if (context.host && context.insertedStyles[context.host.tagName]) {
    return;
  }
  if (context.host) {
    context.insertedStyles[context.host.tagName] = true;
  }
  const nativeElement = mount.ownerDocument.createElement("style");
  nativeElement.appendChild(mount.ownerDocument.createTextNode(""));
  mount.appendChild(nativeElement);
  const sheet = nativeElement.sheet as CSSStyleSheet;

  context.map[element.sheet.id] = sheet;
  insertChildRules(element.sheet, sheet, context);
};

const insertChildRules = (slimRule: SlimCSSGroupingRule, nativeRule: CSSGroupingRule|CSSStyleSheet|CSSKeyframesRule, context: InsertStyleSheetContext) => {
  for (let i = 0, {length} = slimRule.rules; i < length; i++) {
    insertChildRule(slimRule.rules[i], nativeRule, context, i);  
  }
};

const insertChildRule = (slimRule: SlimCSSRule, nativeRule: CSSGroupingRule|CSSStyleSheet|CSSKeyframesRule, context: InsertStyleSheetContext, index: number) => {

  index = Math.min(index, nativeRule.cssRules.length);

  const childRule = shallowStringifyRule(slimRule, context);
  try {
    if ((nativeRule as any).insertRule) {
      (nativeRule as any).insertRule(childRule, index);
    } else {
      (nativeRule as any).appendRule(childRule, index);
    }

    context.map[slimRule.id] = nativeRule.cssRules[index] as any;

    if ((slimRule as SlimCSSGroupingRule).rules) {
      insertChildRules(slimRule as SlimCSSGroupingRule, context.map[slimRule.id] as any, context);
    }
  } catch(e) {
    console.warn(`Unable to insert ${childRule} style`);
    console.error(e.stack);
  }
};

const shallowStringifyRule = (rule: SlimCSSRule, context: InsertStyleSheetContext) => {
  switch(rule.type) {
    case SlimVMObjectType.STYLE_RULE: {
      const { selectorText, style } = rule as SlimCSSStyleRule;
      let buffer = `${stringifyScopedSelectorText(selectorText, context.host)} {`;
      for (const key in style) {

        // TODO - change to isValidCSSKey
        if (key === "id") continue;
        buffer += `${key}: ${style[key]};`
      }

      return `${buffer} }`;
    }
    case SlimVMObjectType.AT_RULE: {
      const { name, params, rules } = rule as SlimCSSAtRule;

      return /^(charset|import)$/.test(name) ? `@${name} "${params}";` : `@${name} ${params} { }`;
    }
  }
};

const getScopeTagName = ({tagName}: SlimElement) => `__${tagName}_scope`;

const getScopeTagNameHost = (element: SlimElement) => getScopeTagName(element) + "__host";

const stringifyScopedSelectorText = (selectorText: string, host: SlimElement) => {
  // if (host) {
  //   console.log(compileScopedCSS(selectorText, getScopeTagName(host)), selectorText);
  // }
  return host ? compileScopedCSS(selectorText, getScopeTagName(host)) : selectorText;
};

const appendNativeChildNodes = ({ childNodes }: SlimParentNode, nativeParent: Element|DocumentFragment, document: Document, context: CreateNativeNodeContext) => {
  for (let i = 0, {length} = childNodes; i < length; i++) {
    const nativeChild = createNativeNode(childNodes[i], document, context);
    if (nativeChild) {
      nativeParent.appendChild(nativeChild);
    }
  }
};

const deleteNestedCSSRules = (rule: SlimCSSGroupingRule, map: CSSOMMap) => {
  map = {
    ...map,
    [rule.id]: undefined
  };

  if (rule.rules) {
    for (let i = rule.rules.length; i--;) {
      map = deleteNestedCSSRules(rule.rules[i] as any, map);
    }
  }

  return map;
};

export const patchDOM2 = (mutation: Mutation<any[]>, root: SlimParentNode, mount: HTMLElement, map: NativeObjectMap): NativeObjectMap => {

  const slimTarget = getVMObjectFromPath(mutation.target, root);
  const ownerDocument = mount.ownerDocument;
  switch(mutation.type) {
    case SET_TEXT_NODE_VALUE: {
      const nativeTarget = map.dom[slimTarget.id];
      (nativeTarget as Text).nodeValue = (mutation as SetValueMutation<any>).newValue;
      break;
    }
    case REMOVE_CHILD_NODE: {
      const { index } = mutation as RemoveChildMutation<any, any>;
      const parent = slimTarget as SlimParentNode;
      const child = parent.childNodes[index];
      const nativeChild = map.dom[child.id];
      map = {
        ...map,
        dom: {
          ...map.dom,
          [child.id]: undefined
        }
      };
      nativeChild.parentNode.removeChild(nativeChild);
      break;
    }
    case SET_ATTRIBUTE_VALUE: {
      const { name, newValue } = mutation as SetPropertyMutation<any>;
      const nativeTarget = map.dom[slimTarget.id] as HTMLElement;
      if (!newValue) {
        nativeTarget.removeAttribute(name);
        nativeTarget.dataset[name.toLowerCase()] = undefined;
      } else {
        nativeTarget.setAttribute(name, newValue);
        nativeTarget.dataset[name.toLowerCase()] = "true";
      }
      break;
    }
    case INSERT_CHILD_NODE: {
      const { child, index } = mutation as InsertChildMutation<any, any>;
      const nativeTarget = map.dom[slimTarget.id];
      let childMap: DOMMap = {};
      const mutationHost = getMutationHost(mutation, root) as SlimElement;
      const nativeChild = createNativeNode(child, ownerDocument, {  
        map: childMap, 
        host: {
          element: mutationHost,
          childNodes: []
        }
      });
      if (index >= nativeTarget.childNodes.length) {
        nativeTarget.appendChild(nativeChild);
      } else {
        nativeTarget.insertBefore(nativeChild, nativeTarget.childNodes[index]);
      }
      map = {
        ...map,
        dom: {
          ...map.dom,
          ...childMap
        }
      }
      break;
    }
    case MOVE_CHILD_NODE: {
      const { index, oldIndex } = mutation as MoveChildMutation<any, any>;
      const parent = slimTarget as SlimParentNode;
      const slimChild = parent.childNodes[index];
      const nativeChild = map[slimChild.id];
      const nativeParent = nativeChild.parentNode;

      nativeParent.removeChild(nativeChild);
      if (index >= nativeParent.childNodes.length) {
        nativeParent.appendChild(nativeChild);
      } else {
        nativeParent.insertBefore(nativeChild, nativeParent.childNodes[index]);
      }
      break;
    }

    case CSS_SET_SELECTOR_TEXT: {
      console.log("TODO", CSS_SET_SELECTOR_TEXT);
      break;
    }

    case CSS_DELETE_RULE: {
      const { index } = mutation as RemoveChildMutation<any, any>;
      const grouping = map.cssom[slimTarget.id];
      const slimChild = (slimTarget as SlimCSSGroupingRule).rules[index];
      const nativeChild = map.cssom[slimChild.id];
      const parentRule: CSSGroupingRule = ((nativeChild as CSSStyleRule).parentRule || (nativeChild as CSSGroupingRule).parentStyleSheet) as any;

      parentRule.deleteRule(Array.prototype.indexOf.call(parentRule.cssRules, nativeChild));
      map = {
        ...map,
        cssom: deleteNestedCSSRules(slimChild as any, map.cssom)
      };

      break;
    }

    case CSS_SET_STYLE_PROPERTY: {
      const { name, newValue } = mutation as SetPropertyMutation<any>;
      const nativeTarget = map.cssom[slimTarget.id] as CSSStyleRule;
      if (newValue == null) {
        nativeTarget.style.removeProperty(name);
      } else {
        nativeTarget.style.setProperty(name, newValue);
      }
      break;
    }

    case CSS_AT_RULE_SET_PARAMS: {
      console.log("TODO", CSS_AT_RULE_SET_PARAMS);
      break;
    }

    case CSS_MOVE_RULE: {
      console.log("TODO", CSS_MOVE_RULE);
      break;
    }

    case CSS_INSERT_RULE: { 
      const { index, child } = mutation as RemoveChildMutation<any, any>;
      const cssomMap = {};
      insertChildRule(child, map.cssom[slimTarget.id] as any, {
        insertedStyles: {},
        map: cssomMap
      }, index);
      map = {
        ...map,
        cssom: {
          ...map.cssom,
          ...cssomMap
        }
      }
      break;
    }
  }

  return map;
};

const getMutationHost = (mutation: Mutation<any[]>, root: SlimParentNode) => {
  const index = mutation.target.lastIndexOf("shadow");
  const path = index > -1 ? mutation.target.slice(0, index) : mutation.target;

  return getVMObjectFromPath(path, root);
}

// do NOT memoize this since computed information may change over time. 
export const computedDOMInfo2 = (map: NativeObjectMap): ComputedDOMInfo => {
  let computedInfo = {};
  for (const nodeId in map.dom) {
    const node = map.dom[nodeId];
    if (!node) {
      continue;
    }

    if (node.nodeName.charAt(0) === "#") {
      continue;
    }
    
    const element = node as HTMLElement;

    if (!element.ownerDocument.defaultView) {
      console.warn(`Element is not attached to the document body.`);
      return {};
    }

    // TODO - memoize computed info here
    computedInfo[nodeId] = {
      bounds: element.getBoundingClientRect(),
      style: element.ownerDocument.defaultView.getComputedStyle(element)
    };
  }
  return computedInfo;
};