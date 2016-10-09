import { getSelectorTester } from "../selector";
import { SyntheticHTMLElement } from "./element";
import { SyntheticCSSStyleDeclaration } from "../css";

export function getComputedStyle(element: SyntheticHTMLElement): SyntheticCSSStyleDeclaration {
  const decl = new SyntheticCSSStyleDeclaration();
  for (const styleSheet of element.ownerDocument.styleSheets) {
    for (const rule of styleSheet.rules) {

      try {
        if (getSelectorTester(rule.selector).test(element)) {
          Object.assign(decl, rule.style);
        }
      } catch (e) {
      }
    }
  }
  return decl;
}