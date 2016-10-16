import {
  CSSExpression,
  CSSDeclarationExpression
} from "./ast";

import { without } from "lodash";
import { camelCase } from "lodash";
import { SyntheticCSSFontFace } from "./font-face";
import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSStyleSheet } from "./style-sheet";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";

export function evaluateCSS(expression: CSSExpression): SyntheticCSSStyleSheet {

  function getStyleDeclaration(rules: CSSDeclarationExpression[]) {
    const declaration = new SyntheticCSSStyleDeclaration();
    for (const decl of rules) {
      declaration[camelCase(decl.name)] = decl.value;
    }return declaration;
  }

  const visitor = {
    visitRoot(root) {
      return new SyntheticCSSStyleSheet(acceptRules(root.rules));
    },
    visitAtRule(atRule): any {

      if (atRule.name === "keyframes") {
        const rule = new SyntheticCSSKeyframesRule(atRule.params);
        rule.cssRules.push(...acceptRules(atRule.rules));
        return rule;
      } else if (atRule.name === "media") {
        const rule = new SyntheticCSSMediaRule([atRule.params]);
        rule.cssRules.push(...acceptRules(atRule.rules));
        return rule;
      } else if (atRule.name === "font-face") {
        const rule = new SyntheticCSSFontFace();
        rule.declaration = getStyleDeclaration(atRule.rules);
        return rule;
      }

      return null;
    },
    visitComment(comment) {
      return null;
    },
    visitDeclaration(declaration) {
      return null;
    },
    visitRule(rule) {
      return new SyntheticCSSStyleRule(rule.selector, getStyleDeclaration(rule.declarations));
    }
  };

  function acceptRules(rules: CSSExpression[]) {
    return without(rules.map((child) => child.accept(visitor)), null);
  }

  return expression.accept(visitor);
}

