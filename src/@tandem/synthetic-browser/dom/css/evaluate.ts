import * as sm from "source-map";
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
import { ISourceLocation } from "@tandem/common";

export function evaluateCSS(expression: postcss.Root, map?: sm.RawSourceMap, module?: SandboxModule): SyntheticCSSStyleSheet {

  const dependency = module && module.source;

  const sourceMapConsumer = map && new sm.SourceMapConsumer(map);

  function getStyleDeclaration(rules: postcss.Declaration[]) {

    const obj = {};

    for (let i = 0, n = rules.length; i < n; i++) {
      const decl = rules[i];

      if (!decl.value) continue;

      // Priority level is not part of the value in regular CSSStyleDeclaration instances. We're
      // Adding it here because it's faster for the app, and easier to work with (for now).
      obj[camelCase(decl.prop)] = decl.value + (decl.important ? " !important" : "");
    }

    return SyntheticCSSStyleDeclaration.fromObject(obj);
  }

  function link<T extends SyntheticCSSObject>(expression: postcss.Node, synthetic: T): T {

    let filePath: string = dependency && dependency.filePath;
    let start =  expression.source.start;
    let end   = expression.source.end;

    if (sourceMapConsumer) {
      const originalPosition = sourceMapConsumer.originalPositionFor({
        line: start.line,
        column: start.column
      });

      start = {
        line: originalPosition.line,

        // Bad. Fixes Discrepancy between postcss & source-map source information.
        // There's also an issue with sass and at rules when inlining styles (which isn't covered here). For example
        // @media { body { color: red; }} will produce incorrect source maps
        column: originalPosition.column + 1
      };

      filePath = originalPosition.source;
      end = undefined;
    }


    synthetic.$source = {
      kind: expression.type,

      // todo - this may not be correct.
      filePath: filePath,
      start: start,
      end: end
    }
    return synthetic;
  }

  const visitor = {
    visitRoot(root: postcss.Root) {
      const ret = link(root, new SyntheticCSSStyleSheet(acceptAll(root.nodes)));
      return ret;
    },
    visitAtRule(atRule: postcss.AtRule): any {

      if (atRule.name === "keyframes") {
        return link(atRule, new SyntheticCSSKeyframesRule(atRule.params, acceptAll(atRule.nodes)));
      } else if (atRule.name === "media") {
        return link(atRule, new SyntheticCSSMediaRule([atRule.params], acceptAll(atRule.nodes)));
      } else if (atRule.name === "font-face") {
        return link(atRule, new SyntheticCSSFontFace(getStyleDeclaration(atRule.nodes as postcss.Declaration[])));
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

  function acceptAll(nodes: postcss.Node[]) {
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

