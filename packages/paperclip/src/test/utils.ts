import { SlimBaseNode, SlimCSSMediaRule, SlimVMObjectType, SlimElement, SlimTextNode, SlimParentNode, SlimStyleElement, SlimCSSGroupingRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElementAttribute, SlimFragment } from "slim-dom";

export const stringifyNode = (node: SlimBaseNode) => {
  switch(node.type) {
    case SlimVMObjectType.TEXT: {
      const text = node as SlimTextNode;
      return text.value;
    }
    case SlimVMObjectType.ELEMENT: {
      const element = node as SlimElement;
      let buffer = `<${element.tagName}`;
      for (const attribute of element.attributes) {
        if (typeof attribute.value === "object") {
          continue;
        }
        buffer += ` ${attribute.name}="${attribute.value}"`;
      }
      buffer += `>`;
      if (element.shadow) {
        buffer += `<#shadow>${stringifyNode(element.shadow)}</#shadow>`;
      }

      buffer += element.childNodes.map(stringifyNode).join("");
      if (element.tagName === "style") {
        buffer += stringifyStyleSheet((element as SlimStyleElement).sheet);
      }
      buffer += `</${element.tagName}>`;
      return buffer;
    }
    case SlimVMObjectType.DOCUMENT_FRAGMENT: 
    case SlimVMObjectType.DOCUMENT: {
      return (node as SlimParentNode).childNodes.map(stringifyNode).join("");
    }
  }
};

const stringifyStyleSheet = (sheet: SlimCSSRule) => {
  switch(sheet.type) {
    case SlimVMObjectType.STYLE_SHEET: {
      return (sheet as SlimCSSStyleSheet).rules.map(stringifyStyleSheet).join(" ");
    }
    case SlimVMObjectType.STYLE_RULE: {
      const rule = sheet as SlimCSSStyleRule;
      let buffer = `${rule.selectorText} {`;
      for (const key in rule.style) {
        if (key === "id" || rule.style[key] == null) continue;
        buffer += `${key}:${rule.style[key]};`
      }
      buffer += `}`
      return buffer;
    }
    case SlimVMObjectType.MEDIA_RULE: {
      const rule = sheet as SlimCSSMediaRule;
      let buffer = `${rule.conditionText} {`;
      buffer += rule.rules.map(stringifyStyleSheet).join("");
      buffer += `}`
      return buffer;
    }
  }
}