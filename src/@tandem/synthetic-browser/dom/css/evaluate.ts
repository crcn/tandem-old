import {
  CSSExpression,
  CSSDeclarationExpression
} from "./ast";

import { without } from "lodash";
import { camelCase } from "lodash";
import { SandboxModule } from "@tandem/sandbox";
import { SyntheticCSSObject } from "./base";
import { SyntheticCSSFontFace } from "./font-face";
import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSStyleSheet } from "./style-sheet";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";

export function evaluateCSS(expression: CSSExpression, module?: SandboxModule): SyntheticCSSStyleSheet {

  const bundle = module && module.bundle;

  function getStyleDeclaration(rules: CSSDeclarationExpression[]) {
    const declaration = new SyntheticCSSStyleDeclaration();
    for (let i = 0, n = rules.length; i < n; i++) {
      const decl = rules[i];
      declaration[camelCase(decl.name)] = decl.value;
    }

    return declaration;
  }

  function link<T extends SyntheticCSSObject<any>>(expression: any, synthetic: T): T {
      synthetic.$expression = expression;
      synthetic.$bundle     = bundle;
      return synthetic;
  }

  const visitor = {
    visitRoot(root) {
      return link(root, new SyntheticCSSStyleSheet(acceptRules(root.rules)));
    },
    visitAtRule(atRule): any {

      if (atRule.name === "keyframes") {
        const rule = link(atRule, new SyntheticCSSKeyframesRule(atRule.params));
        rule.cssRules.push(...acceptRules(atRule.rules));
        return rule;
      } else if (atRule.name === "media") {
        const rule = link(atRule, new SyntheticCSSMediaRule([atRule.params]));
        rule.cssRules.push(...acceptRules(atRule.rules));
        return rule;
      } else if (atRule.name === "font-face") {
        const rule = link(atRule, new SyntheticCSSFontFace());
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
      return link(rule, new SyntheticCSSStyleRule(rule.selector, getStyleDeclaration(rule.declarations)));
    }
  };

  function acceptRules(rules: CSSExpression[]) {
    return without(rules.map((child) => child.accept(visitor)), null);
  }

  return expression.accept(visitor);
}

