import { SlimBaseNode, SlimParentNode, SlimVMObjectType, SlimCSSAtRule, SlimCSSGroupingRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElement, SlimElementAttribute, SlimFragment, SlimStyleElement, SlimTextNode, SlimWindow, VMObjectSource, VMObject } from "./state";
import { patchNode } from "./diff-patch";
import { getAttributeValue, getVMObjectFromPath } from "./utils";
import { DOMNodeMap } from "./dom-renderer";
import { Mutation } from "source-mutation";
import { REMOVE_CHILD_NODE, INSERT_CHILD_NODE, CSS_AT_RULE_SET_PARAMS, CSS_DELETE_RULE, CSS_INSERT_RULE, CSS_MOVE_RULE, CSS_SET_SELECTOR_TEXT, CSS_SET_STYLE_PROPERTY, ATTACH_SHADOW, REMOVE_SHADOW } from "./diff-patch";

export const renderDOM2 = (object: VMObject, root: HTMLElement): DOMNodeMap => {
  const map: DOMNodeMap = {};
  root.appendChild(createNativeNode(object, root.ownerDocument, { map }));
  return map;
};

type CreateNativeNodeContext = {
  host?: {
    element: HTMLElement;
    defaultSlot: Node;
    slots: {
      [identifier: string]: Node
    }
  }
  map: DOMNodeMap;

};

const createNativeNode = (vmNode: VMObject, document: Document, context: CreateNativeNodeContext): Node => {
  switch(vmNode.type) {
    case SlimVMObjectType.ELEMENT: {
      const { tagName, id, shadow, childNodes, attributes } = vmNode as SlimElement;
      if (tagName === "slot") {
        const host = context.host;
        if (!host) {
          return document.createTextNode("");
        }

        const name = getAttributeValue("name", vmNode as SlimElement);
        return (name ? host.slots[name] : host.defaultSlot) || document.createTextNode("");
      }
      if (tagName === "style") {
        // TODO - prefix style based on scope
      }
      const nativeElement = context.map[id] = document.createElement(tagName);
      const nativeChildNodes = childNodes.map(child => createNativeNode(child, document, context));

      for (let i = 0, {length} = attributes; i < length; i++) {
        const attribute = attributes[i];
        if (attribute.name === "style") {
          if (typeof attribute.value === "object") {
            Object.assign(nativeElement[attribute.name], attribute.value);
          }
        } else if (typeof attribute.value !== "object") {
          nativeElement.setAttribute(attribute.name, attribute.value);
        }
      }

      if (shadow) {

        let defaultSlot;
        const slots: any = {};

        for (let i = 0, {length} = nativeChildNodes; i < length; i++) {
          const childNode = nativeChildNodes[i];
          const slotName = childNode.nodeType === 1 && (childNode as Element).getAttribute("slot");
          if (slotName) {
            slots[slotName] = addSlotChild(childNode, slots[slotName]);
          } else {
            defaultSlot = addSlotChild(childNode, defaultSlot);
          }
        }
        
        const nativeShadow = createNativeNode(shadow, document, {
          ...context,
          host: {
            element: nativeElement,
            defaultSlot,
            slots,
          }
        });
        // TODO - get slots
        nativeElement.appendChild(nativeShadow);
      } else {
        for (let i = 0, {length} = nativeChildNodes; i < length; i++) {
          nativeElement.appendChild(nativeChildNodes[i]);
        }
      }
      return nativeElement;
    }
    case SlimVMObjectType.TEXT: {
      const textNode = vmNode as SlimTextNode;
      return context.map[textNode.id] = document.createTextNode(textNode.value);
    }
    case SlimVMObjectType.DOCUMENT: 
    case SlimVMObjectType.DOCUMENT_FRAGMENT: {
      const { childNodes } = vmNode as SlimParentNode;
      const fragment = document.createDocumentFragment();
      for (let i = 0, {length} = childNodes; i < length; i++) {
        fragment.appendChild(createNativeNode(childNodes[i], document, context));
      }
      return fragment;
    }
  }
  return null;
};

const addSlotChild = (child: Node, slot: Node) => {
  if (!slot) {
    return child;
  }
  if (slot.nodeType !== 11) {
    const prevSlot = slot;
    slot = prevSlot.ownerDocument.createDocumentFragment();
    slot.appendChild(prevSlot);
  }
  slot.appendChild(child)
  return slot;
};

const getNativeNodePath = (current: any, root: HTMLElement) => {
  let path: any[] = [];  
  while(current !== root) {
    if ((current as ShadowRoot).host) {
      path.unshift("shadow");
    } else {
      path.unshift(Array.prototype.indexOf.call((current.parentNode as HTMLElement).childNodes, current));
    }
    current = current.host || current.parentNode;
  }
  return path;
};

const patchDOM2 = (mutation: Mutation<any[]>, root: SlimParentNode, mount: HTMLElement, map: DOMNodeMap) => {

  const slimTarget = getVMObjectFromPath(mutation.target, root);

  switch(mutation.type) {
    case REMOVE_CHILD_NODE: {
      if (slimTarget.type === SlimVMObjectType.ELEMENT) {
        const element = slimTarget as SlimElement;
        if (element.shadow) {
          
        }
      }
    }
  }

  return {
    map
  };
};