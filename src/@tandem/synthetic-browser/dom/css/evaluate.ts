import {
  CSSExpression,
  CSSDeclarationExpression
} from "./ast";

import * as postcss from "postcss";
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

export function evaluateCSS(expression: postcss.Root, module?: SandboxModule): SyntheticCSSStyleSheet {

  const bundle = module && module.bundle;

  function getStyleDeclaration(rules: postcss.Declaration[]) {
    const declaration = new SyntheticCSSStyleDeclaration();
    for (let i = 0, n = rules.length; i < n; i++) {
      const decl = rules[i];
      declaration[camelCase(decl.prop)] = decl.value;
    }

    return declaration;
  }

  function link<T extends SyntheticCSSObject>(expression: postcss.Node, synthetic: T): T {
    synthetic.$location = {
      start : expression.source.start,
      end   : expression.source.end
    };
    return synthetic;
  }

  const visitor = {
    visitRoot(root: postcss.Root) {
      const ret = link(root, new SyntheticCSSStyleSheet(accpeptAll(root.nodes)));
      ret.$bundle = bundle;
      return ret;
    },
    visitAtRule(atRule: postcss.AtRule): any {

      if (atRule.name === "keyframes") {
        const rule = link(atRule, new SyntheticCSSKeyframesRule(atRule.params));
        rule.cssRules.push(...accpeptAll(atRule.nodes));
        return rule;
      } else if (atRule.name === "media") {
        const rule = link(atRule, new SyntheticCSSMediaRule([atRule.params]));
        rule.cssRules.push(...accpeptAll(atRule.nodes));
        return rule;
      } else if (atRule.name === "font-face") {
        const rule = link(atRule, new SyntheticCSSFontFace());
        rule.declaration = getStyleDeclaration(atRule.nodes as postcss.Declaration[]);
        return rule;
      }

      return null;
    },
    visitComment(comment: postcss.Comment) {
      return null;
    },
    visitDeclaration(declaration: postcss.Declaration) {
      return null;
    },
    visitRule(rule: postcss.Rule) {
      return link(rule, new SyntheticCSSStyleRule(rule.selector, getStyleDeclaration(rule.nodes as postcss.Declaration[])));
    }
  };

  function accpeptAll(nodes: postcss.Node[]) {
    return without(nodes.map((child) => accept(child)), null);
  }

  function accept(expression: postcss.Node) {
    switch(expression.type) {
      case "root": return visitor.visitRoot(<postcss.Root>expression);
      case "rule": return visitor.visitRule(<postcss.Rule>expression);
      case "atrule": return visitor.visitAtRule(<postcss.AtRule>expression);
      case "comment": return visitor.visitComment(<postcss.Comment>expression);
      case "decl": return visitor.visitDeclaration(<postcss.Declaration>expression);
    }
  }

  return accept(expression);
}

