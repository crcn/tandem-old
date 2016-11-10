import * as postcss from "postcss";
import * as syntax from "postcss-scss";
import { Action, inject, Injector, InjectorProvider, sourcePositionEquals, MimeTypeProvider } from "@tandem/common";
import {
  SyntheticCSSStyleRule,
  syntheticCSSRuleType,
  SyntheticCSSStyleSheetEdit,
  SyntheticCSSMediaRuleEdit,
  SyntheticCSSAtRuleEdit,
  SyntheticCSSAtRule,
  CSSEditor,
  SyntheticCSSKeyframesRuleEdit,
  SyntheticCSSStyleRuleEdit,
} from "@tandem/synthetic-browser";
import {
  Dependency,
  EditAction,
  IContentEdit,
  BaseContentEdit,
  InsertChildEditAction,
  RemoveChildEditAction,
  MoveChildEditAction,
  ISyntheticObject,
  ISyntheticObjectChild,
  ISyntheticSourceInfo,
  BaseContentEditor,
  SetValueEditActon,
  SetKeyValueEditAction,
} from "@tandem/sandbox";

// TODO - move this to synthetic-browser
// TODO - may need to split this out into separate CSS editors. Some of this is specific
// to SASS
export class SCSSEditor extends CSSEditor {

  [SyntheticCSSStyleRuleEdit.SET_RULE_SELECTOR](node: postcss.Rule, { target, newValue }: SetValueEditActon) {
    const source = target.source;

    // prefix here is necessary
    const prefix = this.getRuleSelectorPrefix(node);
    node.selector = (node.selector.indexOf("&") === 0 ? "&" : "") + newValue.replace(prefix, "");
  }

  protected findTargetASTNode(root: postcss.Container, target: ISyntheticObject) {
    let found: postcss.Node;

    const walk = (node: postcss.Node, index: number) => {

      let offsetStart = {
        line: target.source.start.line,
        column: target.source.start.column
      };

      if (!node.source) return;

      const nodeStart = node.source.start;

      // Bug fix (I need to report this): Source map column numbers shift +1 for each CSS rule. This fixes that.
      const ruleCount = this.countRulesOnLineBefore(node);

      if (ruleCount) {
        offsetStart.column -= ruleCount;
      }

      if (node.type === target.source.kind && target.source && sourcePositionEquals(nodeStart, offsetStart)) {

        // next find the actual node that the synthetic matches with -- the source position may not be
        // entirely accurate for cases such as nested selectors.
        found = this.findNestedASTNode(<any>node, target);
        return false;
      }
    };

    if (walk(root, -1) !== false) {
      root.walk(walk);
    }

    return found;
  }

  private countRulesOnLineBefore(node: postcss.Node) {
    let count = 0;
    let stopped = false;

    if (this._rootASTNode === node) return 0;

    (<postcss.Root>this._rootASTNode).walk((child: postcss.Node) => {
      if (child === node) {
        stopped = true;
      }
      if (stopped) return;
      if (child.type === "rule" && child.source && child.source.start.line === node.source.start.line) {
        count++;
      }
    });

    return count;
  }

  private findNestedASTNode(node: postcss.Container, target: ISyntheticObject): postcss.Node {
    if (isRuleNode(node)) {
      return this.findMatchingRuleNode(<postcss.Rule>node, <SyntheticCSSStyleRule>target);
    } else {
      return node;
    }
  }

  /**
   *
   *
   * @private
   * @param {postcss.Rule} node
   * @param {SyntheticCSSStyleRule} synthetic
   * @param {string} [prefix='']
   * @returns {postcss.Rule}
   */

  private findMatchingRuleNode(node: postcss.Rule, synthetic: SyntheticCSSStyleRule, prefix = ''): postcss.Rule {
    let found: postcss.Rule;
    const selector = prefix + (!prefix.length || node.selector.search(/^\&/) !== -1 ? node.selector.replace(/^\&/, "") : " " + node.selector);
    if (selector === synthetic.selector) return node;
    node.each((child) => {
      if (isRuleNode(child) && (found = this.findMatchingRuleNode(<postcss.Rule>child, synthetic, selector))) {
        return false;
      }
    });

    return found;
  }

  /**
   * for nested selectors
   *
   * @private
   * @param {postcss.Rule} node
   * @returns
   */

  private getRuleSelectorPrefix(node: postcss.Rule){
    let prefix = "";
    let current = node;
    while(current = <postcss.Rule>current.parent) {
      if (!isRuleNode(current)) break;
      prefix = current.selector.replace(/^&/, "") + prefix;
    }
    return prefix;
  }

  parseContent(content: string) {
    return parseSCSS(content);
  }

  getFormattedContent(root: postcss.Rule) {

    // try parsing again. This should throw an error if any edits are invalid.
    parseSCSS(root.toString());

    return root.toString();
  }
}

function parseSCSS(content: string) {
  return postcss().process(content, {
    syntax: syntax
  }).root;
}

function isRuleNode(node: postcss.Node) {
  return node.type === "rule";
}