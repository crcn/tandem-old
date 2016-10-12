import {
  CSSExpression,
} from "./ast";

import { without } from "lodash";
import { camelCase } from "lodash";
import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSStyleSheet } from "./style-sheet";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";

export function evaluateCSS(expression: CSSExpression): SyntheticCSSStyleSheet {

  const visitor = {
    visitRoot(root) {
      return new SyntheticCSSStyleSheet(acceptRules(root.rules));
    },
    visitAtRule(atRule) {

      let parentRule: SyntheticCSSKeyframesRule|SyntheticCSSMediaRule;

      if (atRule.name === "keyframes") {
        parentRule = new SyntheticCSSKeyframesRule(atRule.params);
      } else if (atRule.name === "media") {
        parentRule = new SyntheticCSSMediaRule([atRule.params]);
      } else {
        return null;
      }

      parentRule.cssRules.push(...acceptRules(atRule.rules));

      return parentRule;
    },
    visitComment(comment) {
      return null;
    },
    visitDeclaration(declaration) {
      return null;
    },
    visitRule(rule) {
      const declaration = new SyntheticCSSStyleDeclaration();
      for (const decl of rule.declarations) {
        declaration[camelCase(decl.name)] = decl.value;
      }
      return new SyntheticCSSStyleRule(rule.selector, declaration);
    }
  };

  function acceptRules(rules: CSSExpression[]) {
    return without(rules.map((child) => child.accept(visitor)), null);
  }

  return expression.accept(visitor);
}

