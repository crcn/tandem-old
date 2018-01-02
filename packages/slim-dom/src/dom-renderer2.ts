import { SlimBaseNode, SlimParentNode, SlimVMObjectType, SlimCSSAtRule, SlimCSSGroupingRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElement, SlimElementAttribute, SlimFragment, SlimStyleElement, SlimTextNode, SlimWindow, VMObjectSource, VMObject, SlimFontFace } from "./state";
import { getAttributeValue, getVMObjectFromPath, compileScopedCSS, getSlot, getNodeSlotName, getSlotChildren, getSlotChildrenByName, getVMObjectPath, getVMObjectIdType } from "./utils";
import { DOMNodeMap, ComputedDOMInfo } from "./dom-renderer";
import { Mutation, InsertChildMutation, RemoveChildMutation, SetPropertyMutation, SetValueMutation, MoveChildMutation } from "source-mutation";
import { REMOVE_CHILD_NODE, INSERT_CHILD_NODE, CSS_AT_RULE_SET_PARAMS, CSS_DELETE_RULE, CSS_INSERT_RULE, CSS_MOVE_RULE, CSS_SET_SELECTOR_TEXT, CSS_SET_STYLE_PROPERTY, ATTACH_SHADOW, REMOVE_SHADOW, SET_ATTRIBUTE_VALUE, MOVE_CHILD_NODE, SET_TEXT_NODE_VALUE, patchNode2 } from "./diff-patch";
import { weakMemo } from "./weak-memo";

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
  root.appendChild(createNativeNode(object, root.ownerDocument, { map: domMap, root: object as SlimParentNode }));
  insertStyleSheets(object as SlimParentNode, root, { map: cssomMap });
  return { dom: domMap, cssom: cssomMap };
};

type CreateNativeNodeContext = {
  host?: SlimElement;
  root: SlimParentNode;
  map: DOMMap;
};

type InsertStyleSheetContext = {
  scope?: string;
  host?: SlimElement;
  map: CSSOMMap
};

const createNativeNode = (vmNode: VMObject, document: Document, context: CreateNativeNodeContext): Node => {
  switch(vmNode.type) {
    case SlimVMObjectType.ELEMENT: {
      const { tagName, type, id, shadow, childNodes, attributes } = vmNode as SlimElement;
      
      if (tagName === "style") {
        return null;
      }

      if (tagName === "slot") {

        // Note that document fragment is necessary for slots to ensure that that certain props are inheritable from the parent (like display: flex)
        const slotElement = document.createDocumentFragment();

        // add a marker so that elements can be dynamically inserted when patched
        slotElement.appendChild(context.map[vmNode.id] = document.createTextNode(""));

        const host = context.host;

        if (host) {
          const slotName = getAttributeValue("name", vmNode as SlimElement);
          const slotChildNodes = getSlotChildrenByName(slotName, host);
          
          for (let i = 0, {length} = slotChildNodes; i < length; i++) {
            const child = slotChildNodes[i];
            slotElement.appendChild(createNativeNode(child, document, {
              ...context,
              host: getNodeHost(child, context.root as SlimParentNode)
            }));
          }
        }

        // append default slot element children
        if (slotElement.childNodes.length === 1) {
          appendNativeChildNodes(vmNode as SlimParentNode, slotElement, document,  context)
        }

        return  slotElement;
      }
      

      const nativeElement = context.map[vmNode.id] = document.createElement(tagName);

      
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
        nativeElement.classList.add(getElementScopeTagName(context.host));
      }
      
      if (shadow) {
        nativeElement.classList.add(getElementScopeTagName(vmNode as SlimElement) + "_host");
      }

      if (shadow) {
        context.map[shadow.id] = nativeElement;
        const nativeShadow = createNativeNode(shadow, document, {
          ...context,
          host: vmNode as SlimElement
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
  const nativeElement = mount.ownerDocument.createElement("style");
  nativeElement.appendChild(mount.ownerDocument.createTextNode(""));
  mount.appendChild(nativeElement);
  const sheet = nativeElement.sheet as CSSStyleSheet;

  context.map[element.sheet.id] = sheet;
  const scope = getAttributeValue("scope", element);
  insertChildRules(element.sheet, sheet, { ...context, scope });
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
      return `${stringifyScopedSelectorText(selectorText, context)} { ${stringifyStyle(style)} }`;
    }

    case SlimVMObjectType.FONT_FACE_RULE: {
      const {  style } = rule as SlimFontFace;
      return `@font-face { ${stringifyStyle(style)} }`;
    }
    case SlimVMObjectType.AT_RULE: {
      const { name, params, rules } = rule as SlimCSSAtRule;

      return /^(charset|import)$/.test(name) ? `@${name} "${params}";` : `@${name} ${params} { }`;
    }
  }
};

const stringifyStyle = (style) => {
  let buffer: string = ``;

  for (const key in style) {

    // TODO - change to isValidCSSKey
    if (key === "id") continue;
    buffer += `${key}: ${style[key]};`
  }

  return buffer;
}

const getScopeTagName = (tagName: string) => `__${tagName}_scope`
const getElementScopeTagName = ({tagName}: SlimElement) => getScopeTagName(tagName);

const getElementScopeTagNameHost = (element: SlimElement) => getElementScopeTagName(element) + "__host";

const stringifyScopedSelectorText = (selectorText: string, context: InsertStyleSheetContext) => {
  // if (host) {
  //   console.log(compileScopedCSS(selectorText, getElementScopeTagName(host)), "-----", selectorText);
  // }
  return context.scope ? compileScopedCSS(selectorText, getScopeTagName(context.scope)) : selectorText;
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
      map = removeNativeChildNode(child, map);
      break;
    }
    case SET_ATTRIBUTE_VALUE: {
      const { name, newValue } = mutation as SetPropertyMutation<any>;
      const slimElement = slimTarget as SlimElement;
      const nativeTarget = map.dom[slimTarget.id] as HTMLElement;

      if (slimElement.tagName === "slot") {
        if (name === "name") {
          // TODO - get host
          // TODO - insert children
          const host = getMutationHost(mutation, root);
          const oldSlotChildren = getSlotChildren(slimElement, host);

          for (let i = oldSlotChildren.length; i--;) {
            const child = oldSlotChildren[i];
            map = removeNativeChildNode(child, map);
          }

          const newSlotChildren = getSlotChildrenByName(newValue, host);

          const nativeParent = nativeTarget.parentNode;
        
          const slotIndex = Array.prototype.indexOf.call(nativeParent.childNodes, nativeTarget);

          let childMap: DOMMap = {};

          for (let i = 0, {length} = newSlotChildren; i < length; i++) {
            const child = newSlotChildren[i];
            const childHost = getNodeHost(child, root);
            const newNativeChild = createNativeNode(newSlotChildren[i], nativeTarget.ownerDocument, {
              root: root,
              map: childMap,
              host: childHost
            });

            insertNativeNode(newNativeChild, slotIndex + i + 1, nativeParent);
          }
          
          map = {
            ...map,
            dom: {
              ...map.dom,
              ...childMap,
            }
          };
        }

      } else {
        if (!newValue) {
          nativeTarget.removeAttribute(name);
          nativeTarget.dataset[name.toLowerCase()] = undefined;
        } else {
          nativeTarget.setAttribute(name, newValue);
          nativeTarget.dataset[name.toLowerCase()] = "true";
        }
      }
      break;
    }
    case INSERT_CHILD_NODE: {
      const { child, index } = mutation as InsertChildMutation<any, any>;
      let insertIndex = index;

      let nativeParent: Node;

      if ((slimTarget as SlimElement).shadow) {
        const slot = getSlot(getNodeSlotName(child), slimTarget as SlimElement);
        const nativeSlotMarker = map.dom[slot.id];
        const nativeSlotParent = nativeSlotMarker.parentNode;
        const nativeSlotIndex  = Array.prototype.indexOf.call(nativeSlotParent.childNodes, nativeSlotMarker);
        nativeParent = nativeSlotParent;
        insertIndex = nativeSlotIndex + index + 1;
      } else {
        nativeParent = map.dom[slimTarget.id];
      }

      let childMap: DOMMap = {};
      const mutationHost = getMutationHost(mutation, root) as SlimElement;
      // console.log(mutation.target, mutationHost);
      const nativeChild = createNativeNode(child, ownerDocument, {  
        map: childMap,
        root: root,
        host: mutationHost
      });
      insertNativeNode(nativeChild, insertIndex, nativeParent);
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
      insertNativeNode(nativeChild, index, nativeParent);
      break;
    }

    case CSS_SET_SELECTOR_TEXT: {
      const { newValue } = mutation as SetValueMutation<any>;
      const nativeTarget: CSSStyleRule = map.cssom[slimTarget.id] as CSSStyleRule;
      nativeTarget.selectorText = newValue;
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
      const { newValue } = mutation as SetValueMutation<any>;
      const nativeTarget: CSSMediaRule = map.cssom[slimTarget.id] as CSSMediaRule;
      nativeTarget.conditionText = newValue;
      break;
    }

    case CSS_MOVE_RULE: {
      const { index, oldIndex } = mutation as MoveChildMutation<any, any>;
      const nativeTarget = map.cssom[slimTarget.id] as any;
      
      const cssomMap = {};

      const styleElement = getStyleElementFomPath(mutation.target, root);
      const scope = getAttributeValue("scope", styleElement);

      if ((nativeTarget as any as CSSKeyframesRule).appendRule) {
        const patchedRoot = patchNode2(mutation, root);
        const patchedSlimParent = getVMObjectFromPath(mutation.target, patchedRoot) as SlimCSSGroupingRule;
        while(nativeTarget.cssRules.length) {
          nativeTarget.deleteRule(0);
        }

        insertChildRules(patchedSlimParent, nativeTarget, {
          map: cssomMap,
          scope,
        });
      } else {
        nativeTarget.deleteRule(oldIndex);
        insertChildRule((slimTarget as SlimCSSGroupingRule).rules[oldIndex], nativeTarget, {
          map: cssomMap,
          scope
        }, index);
      }

      map = {
        ...map,
        cssom: {
          ...map.cssom,
          ...cssomMap
        }
      }
      break;
    }

    case CSS_INSERT_RULE: { 
      const { index, child } = mutation as RemoveChildMutation<any, any>;
      const cssomMap = {};
      const styleElement = getStyleElementFomPath(mutation.target, root);
      insertChildRule(child, map.cssom[slimTarget.id] as any, {
        map: cssomMap,
        scope: getAttributeValue("scope", styleElement)
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

const removeNativeChildNode = (child: SlimBaseNode, map: NativeObjectMap) => {
  const nativeChild = map.dom[child.id];

  // happens for style elements
  if (!nativeChild) {
    console.warn(`${JSON.stringify(child)} does not have an associative native DOM node.`);
    return map;
  }
  map = {
    ...map,
    dom: {
      ...map.dom,
      [child.id]: undefined
    }
  };
  nativeChild.parentNode.removeChild(nativeChild);
  return map;
};

const insertNativeNode = (child: Node, index: number, parent: Node) => {  
  if (index >= parent.childNodes.length) {
    parent.appendChild(child);
  } else {
    parent.insertBefore(child, parent.childNodes[index]);
  }
};

const getMutationHost = (mutation: Mutation<any[]>, root: SlimParentNode) => getHostFromPath(mutation.target, root);

const getNodeHost = (child: SlimBaseNode, root: SlimParentNode) => getHostFromPath(getVMObjectPath(child, root), root);

const getHostFromPath = weakMemo((path: string[], root: SlimParentNode) => {
  const index = path.lastIndexOf("shadow");
  if (index === -1) {
    return null;
  }
  return getVMObjectFromPath(path.slice(0, index), root) as SlimElement;
});

const getStyleElementFomPath = weakMemo((path: string[], root: SlimParentNode) => {
  const index = path.lastIndexOf("sheet");
  if (index === -1) {
    return null;
  }
  return getVMObjectFromPath(path.slice(0, index), root) as SlimElement;
});

// do NOT memoize this since computed information may change over time. 
export const computedDOMInfo2 = (map: NativeObjectMap): ComputedDOMInfo => {
  let computedInfo = {};
  for (const nodeId in map.dom) {
    const node = map.dom[nodeId];

    if (!node || getVMObjectIdType(nodeId) !== SlimVMObjectType.ELEMENT) {
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