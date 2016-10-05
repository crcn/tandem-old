import {
  CSSExpression,
} from "./ast";

import { camelCase } from "lodash";
import { SyntheticCSSStyleRule } from "./rule";
import { SyntheticCSSStyleSheet } from "./style-sheet";
import { SyntheticCSSStyleDeclaration } from "./declaration";

export function evaluateCSS(expression: CSSExpression): SyntheticCSSStyleSheet {
  return expression.accept({
    visitRoot(root) {
      return new SyntheticCSSStyleSheet(root.rules.map((rule) => rule.accept(this)));
    },
    visitAtRule(atRule) {
      return { cssText: "" };
    },
    visitComment(comment) {
      return { cssText: "" };
    },
    visitDeclaration(declaration) {

    },
    visitRule(rule) {
      const declaration = new SyntheticCSSStyleDeclaration();
      for (const decl of rule.declarations) {
        declaration[camelCase(decl.name)] = decl.value;
      }
      return new SyntheticCSSStyleRule(rule.selector, declaration);
    }
  });
}

