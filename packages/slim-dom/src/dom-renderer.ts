import { SlimParentNode, SlimVMObjectType, SlimElement, SlimTextNode, SlimBaseNode, SlimStyleElement, SlimCSSStyleSheet, SlimCSSStyleRule, SlimCSSAtRule, SlimCSSRule, Bounds, VMObject, SlimFontFace } from "./state";
import { weakMemo, getVMObjectFromPath } from "./utils";
import { Mutation, SetValueMutation, SetPropertyMutation, RemoveChildMutation, InsertChildMutation, MoveChildMutation } from "source-mutation"
import { SET_TEXT_NODE_VALUE, REMOVE_CHILD_NODE, INSERT_CHILD_NODE, MOVE_CHILD_NODE, CSS_MOVE_RULE, CSS_INSERT_RULE, CSS_DELETE_RULE, CSS_SET_SELECTOR_TEXT, CSS_SET_STYLE_PROPERTY } from "./diff-patch";

export const renderDOM = (node: SlimBaseNode, mount: HTMLElement, options: RenderOptions = {}) => {
  let map: DOMNodeMap = {};
  mount.appendChild(createNode(node, mount.ownerDocument, map, options));
  return map;
};

export type DOMNodeMap = {
  [identifier: string]: any
};

const createNode = (node: SlimBaseNode, document: Document, map: DOMNodeMap, options: RenderOptions) => {
  switch(node.type) {
    case SlimVMObjectType.TEXT: {
      return map[node.id] = document.createTextNode((node as SlimTextNode).value);
    }
    case SlimVMObjectType.ELEMENT: {
      const { tagName, id, shadow, childNodes, attributes } = node as SlimElement;
      const ret = map[id] = document.createElement(tagName);
      if (shadow) {
        ret.attachShadow({ mode: "open" }).appendChild(createNode(shadow, document, map, options));
      }

      if (tagName === "style") {
        renderStyle((node as SlimStyleElement).sheet, ret as HTMLStyleElement, options);
      }
      for (let i = 0, {length} = attributes; i < length; i++) {
        const attribute = attributes[i];
        if (attribute.name === "style") {
          if (typeof attribute.value === "object") {
            Object.assign(ret[attribute.name], attribute.value);
          } 
        } else if (typeof attribute.value !== "object") {
          ret.setAttribute(attribute.name, attribute.value);
        }
      }
      for (let i = 0, {length} = childNodes; i < length; i++) {
        ret.appendChild(createNode(childNodes[i], document, map, options));
      }
      return ret;
    }
    case SlimVMObjectType.DOCUMENT_FRAGMENT: {
      const { childNodes } = node as SlimParentNode;
      const fragment = document.createDocumentFragment();
      for (let i = 0, {length} = childNodes; i < length; i++) {
        fragment.appendChild(createNode(childNodes[i], document, map, options));
      }
      return fragment;
    }
    default: {
      console.warn(`Unable to render node`);
      return document.createTextNode(``);
    }
  }
};

const renderStyle = (sheet: SlimCSSStyleSheet, element: HTMLStyleElement, options: RenderOptions) => {
  element.textContent = stringifyStyleSheet(sheet, options);
}

const stringifyStyleSheet = (sheet: SlimCSSStyleSheet, options: RenderOptions) => {
  let buffer = ``;
  for (let i = 0, {length} = sheet.rules; i < length; i++) {
    const rule = sheet.rules[i];
    const ruleText = stringifyRule(sheet.rules[i], options);
    if (!ruleText) {
      continue;
    }

    buffer += `${ruleText}\n`;
  }
  return buffer;
};

export type RenderOptions = {
  filePathAliases?: {
    [identifier: string]: string
  }
}

// TODO - move to util file
const stringifyRule = (rule: SlimCSSRule, options: RenderOptions) => {
  switch(rule.type) {
    case SlimVMObjectType.STYLE_RULE: {
      const { selectorText, style } = rule as SlimCSSStyleRule;
      return `${selectorText} { ${stringifyStyle(style)} }`;
    }
    case SlimVMObjectType.FONT_FACE_RULE: {
      const {  style } = rule as SlimFontFace;
      return `@font-face { ${stringifyStyle(style)} }`;
    }
    case SlimVMObjectType.AT_RULE: {
      const { name, params, rules } = rule as SlimCSSAtRule;

      return /^(charset|import)$/.test(name) ? `@${name} "${params}";` : `@${name} ${params} { ${rules.map(rule => stringifyRule(rule, options)).join(" ")} }`;
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

export type ComputedDOMElementInfo = {
  bounds: Bounds;
  style: CSSStyleDeclaration;
};

export type ComputedDOMInfo = {
  [identifier: string]: ComputedDOMElementInfo
};

// do NOT memoize this since computed information may change over time. 
export const computedDOMInfo = (map: DOMNodeMap): ComputedDOMInfo => {
  let computedInfo = {};
  for (const nodeId in map) {
    const node = map[nodeId];
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

const getDOMNodeFromPath = (path: any[], root: HTMLElement) => {
  let current: any = root;
  for (let i = 0, {length} = path; i < length; i++) {
    const part = path[i];

    if (part === "shadow") {
      current = (current as HTMLElement).shadowRoot;
    } else {
      current = current.childNodes[part];
    }
    if (!current) {
      return null;
    }
  }
  return current;
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

// TODO
export const patchDOM = (diffs: Mutation<any[]>[], slimRoot: SlimParentNode, map: DOMNodeMap, root: HTMLElement, options: RenderOptions = {}): DOMNodeMap => {
  const resetStyleMap: HTMLStyleElement[] = [];

  for (let i = 0, {length} = diffs; i < length; i++) {
    const mutation = diffs[i];
    let target = getDOMNodeFromPath(mutation.target, root);

    switch(mutation.type) {
      case SET_TEXT_NODE_VALUE: {
        (target as Text).nodeValue = (mutation as SetValueMutation<any>).newValue;
        break;
      }
      // case SET_ATTRIBUTE_VALUE: {
      //   const { name, newValue } = mutation as SetPropertyMutation<any>;
      //   if (!newValue) {
      //     (target as HTMLElement).removeAttribute(name);
      //   } else {
      //     (target as HTMLElement).setAttribute(name, newValue);
      //   }
      //   break;
      // }
      case REMOVE_CHILD_NODE: {
        const { child, index } = mutation as RemoveChildMutation<any, any>;
        map = { ...map, [child]: undefined };
        target.removeChild(target.childNodes[index]);
        break;
      }
      case INSERT_CHILD_NODE: {
        const { child, index } = mutation as InsertChildMutation<any, any>;
        let childMap: DOMNodeMap = {};
        const nativeChild = createNode(child, root.ownerDocument, childMap, options);
        if (index >= target.childNodes.length) {
          target.appendChild(nativeChild);
        } else {
          target.insertBefore(nativeChild, target.childNodes[index]);
        }
        map = { ...map, ...childMap };
        break;
      }

      case MOVE_CHILD_NODE: {
        const { index, oldIndex } = mutation as MoveChildMutation<any, any>;
        const child = target.childNodes[oldIndex];
        target.removeChild(child);
        if (index >= target.childNodes.length) {
          target.appendChild(child);
        } else {
          target.insertBefore(child, target.childNodes[index]);
        }
        break;
      }

      case CSS_INSERT_RULE:
      case CSS_DELETE_RULE: 
      case CSS_MOVE_RULE: 
      case CSS_SET_SELECTOR_TEXT: 
      case CSS_SET_STYLE_PROPERTY: {
        const stylePath =  mutation.target.slice(0, mutation.target.indexOf("sheet"));
        
        const nativeStyle = getDOMNodeFromPath(stylePath, root) as HTMLStyleElement;
        if (resetStyleMap.indexOf(nativeStyle) === -1) {
          resetStyleMap.push(nativeStyle);
        }
        break;
      }
    }
  }

  for (const nativeStyle of resetStyleMap) {
    const slimStyle = getVMObjectFromPath(getNativeNodePath(nativeStyle, root), slimRoot) as SlimStyleElement;

    const sheet = nativeStyle.sheet as CSSStyleSheet;
    const rules = slimStyle.sheet.rules;
    while(sheet.rules.length) {
      sheet.deleteRule(0);
    }
    for (let i = 0, {length} = rules; i < length; i++) {
      const synthRule = rules[i];
      const synthRuleText = stringifyRule(slimStyle.sheet.rules[i], options);
      try {
        sheet.insertRule(synthRuleText, i);
      } catch(e) {
        
      }
    }
  }

  return map;
};