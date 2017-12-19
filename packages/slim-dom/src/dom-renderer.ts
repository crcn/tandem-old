import { ParentNode, NodeType, Element, TextNode, BaseNode, StyleElement, CSSStyleSheet as SDCSSStyleSheet, CSSStyleRule as SDCSSStyleRule, CSSRuleType, CSSMediaRule as SDCSSMediaRule, CSSRule as SDCSSRule, Bounds } from "./state";
import { weakMemo } from "./utils";

export const renderDOM = (node: BaseNode, mount: HTMLElement) => {
  let map: DOMNodeMap = {};
  mount.appendChild(createNode(node, mount.ownerDocument, map));
  return map;
};

export type DOMNodeMap = {
  [identifier: string]: HTMLElement
};

const createNode = (node: BaseNode, document: Document, map: DOMNodeMap) => {
  switch(node.type) {
    case NodeType.TEXT: {
      return document.createTextNode((node as TextNode).value);
    }
    case NodeType.ELEMENT: {
      const { tagName, id, shadow, childNodes, attributes } = node as Element;
      const ret = map[id] = document.createElement(tagName);
      if (shadow) {
        ret.attachShadow({ mode: "open" }).appendChild(createNode(shadow, document, map));
      }

      if (tagName === "style") {
        renderStyle((node as StyleElement).sheet, ret as HTMLStyleElement);
      }
      for (let i = 0, {length} = attributes; i < length; i++) {
        const attribute = attributes[i];
        if (attribute.name === "style") {
          if (typeof attribute.value === "object") {
            Object.assign(ret[attribute.name], attribute.value);
          }
        } else if (attribute.value) {
          ret.setAttribute(attribute.name, attribute.value);
        }
      }
      for (let i = 0, {length} = childNodes; i < length; i++) {
        ret.appendChild(createNode(childNodes[i], document, map));
      }
      return ret;
    }
    case NodeType.DOCUMENT_FRAGMENT: {
      const { childNodes } = node as ParentNode;
      const fragment = document.createDocumentFragment();
      for (let i = 0, {length} = childNodes; i < length; i++) {
        fragment.appendChild(createNode(childNodes[i], document, map));
      }
      return fragment;
    }
    default: {
      console.warn(`Unable to render node`);
      return document.createTextNode(``);
    }
  }
};

const renderStyle = (sheet: SDCSSStyleSheet, element: HTMLStyleElement) => {
  let j = 0;
  let buffer = ``;
  for (let i = 0, {length} = sheet.rules; i < length; i++) {
    const rule = sheet.rules[i];
    const ruleText = stringifyRule(sheet.rules[i]);
    if (!ruleText) {
      continue;
    }

    buffer += `${ruleText}\n`;
  }

  element.textContent = buffer;
}

// TODO - move to util file
const stringifyRule = (rule: SDCSSRule) => {
  switch(rule.type) {
    case CSSRuleType.STYLE_RULE: {
      const { selectorText, style } = rule as SDCSSStyleRule;
      let buffer = `${selectorText} {`;
      for (const key in style) {
        buffer += `${key}: ${style[key]};`
      }

      return `${buffer} }`;
    }
    case CSSRuleType.MEDIA_RULE: {
      const { conditionText, rules } = rule as SDCSSMediaRule;
      return `@media ${conditionText} { ${rules.map(stringifyRule)} }`
    }
  }
};

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
    const element = map[nodeId];

    // TODO - memoize computed info here
    computedInfo[nodeId] = {
      bounds: element.getBoundingClientRect(),
      style: element.ownerDocument.defaultView.getComputedStyle(element)
    };
  }
  return computedInfo;
};

// TODO
export const patchDOM = (diffs: any[], container: HTMLElement) => {

};