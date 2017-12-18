import { ParentNode, NodeType, Element, TextNode, BaseNode, StyleElement, CSSStyleSheet as SDCSSStyleSheet, CSSStyleRule as SDCSSStyleRule, CSSRuleType, CSSMediaRule as SDCSSMediaRule, CSSRule as SDCSSRule } from "./state";

export const renderDOM = (node: BaseNode, mount: HTMLElement) => {
  mount.appendChild(createNode(node, mount.ownerDocument));
};

const createNode = (node: BaseNode, document: Document) => {
  switch(node.type) {
    case NodeType.TEXT: {
      return document.createTextNode((node as TextNode).value);
    }
    case NodeType.ELEMENT: {
      const { tagName, shadow, childNodes, attributes } = node as Element;
      const ret = document.createElement(tagName);
      if (shadow) {
        ret.attachShadow({ mode: "open" }).appendChild(createNode(shadow, document));
      }

      if (tagName === "style") {
        renderStyle((node as StyleElement).sheet, ret as HTMLStyleElement);
      }
      for (let i = 0, {length} = attributes; i < length; i++) {
        const attribute = attributes[i];
        ret.setAttribute(attribute.name, attribute.value);
      }
      for (let i = 0, {length} = childNodes; i < length; i++) {
        ret.appendChild(createNode(childNodes[i], document));
      }
      return ret;
    }
    case NodeType.DOCUMENT_FRAGMENT: {
      const { childNodes } = node as ParentNode;
      const fragment = document.createDocumentFragment();
      for (let i = 0, {length} = childNodes; i < length; i++) {
        fragment.appendChild(createNode(childNodes[i], document));
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
}

// TODO
export const patchDOM = (diffs: any[], container: HTMLElement) => {

};