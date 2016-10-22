import { getSelectorTester } from "../selector";
import { SyntheticHTMLElement } from "./element";
import { SyntheticCSSStyleDeclaration, SyntheticCSSStyleRule } from "../css";


export function getComputedStyle(element: SyntheticHTMLElement): SyntheticCSSStyleDeclaration {
  const decl = new SyntheticCSSStyleDeclaration();
  for (const styleSheet of element.ownerDocument.styleSheets) {
    for (const rule of styleSheet.rules) {
      if (rule["selector"] && getSelectorTester((<SyntheticCSSStyleRule>rule).selector).test(element)) {
        Object.assign(decl, (<SyntheticCSSStyleRule>rule).style);
      }
    }
  }
  return decl;
}