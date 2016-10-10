import { getSelectorTester } from "../selector";
import { SyntheticHTMLElement } from "./element";
import { SyntheticCSSStyleDeclaration } from "../css";

const _computedStyles = {};

//
function calculateNativeComputedStyle(tagName: string): any {
  if (_computedStyles[tagName]) return _computedStyles[tagName];
  const element = document.createElement(tagName);
  document.body.appendChild(element);
  _computedStyles[tagName] = Object.assign({}, window.getComputedStyle(element));
  document.body.removeChild(element);
  return calculateNativeComputedStyle(tagName);
}

export function getComputedStyle(element: SyntheticHTMLElement): SyntheticCSSStyleDeclaration {
  const decl = new SyntheticCSSStyleDeclaration();
  Object.assign(decl, calculateNativeComputedStyle(element.tagName), element.style);
  for (const styleSheet of element.ownerDocument.styleSheets) {
    for (const rule of styleSheet.rules) {
      if (getSelectorTester(rule.selector).test(element)) {
        Object.assign(decl, rule.style);
      }
    }
  }
  return decl;
}