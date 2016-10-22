import * as postcss from "postcss";
import * as postcssSassSyntax from "postcss-scss";
import { Action, inject, Dependencies, DependenciesDependency, sourcePositionEquals } from "@tandem/common";
import { SyntheticCSSStyleRule, SetRuleSelectorEditAction, parseCSS, SetDeclarationEditAction } from "@tandem/synthetic-browser";
import {
  Bundle,
  EditAction,
  ISynthetic,
  IContentEdit,
  IContentEditor,
  BaseContentEdit,
  BaseContentEditor,
  loadBundleContent,
} from "@tandem/sandbox";

// TODO - move this to synthetic-browser
// TODO - may need to split this out into separate CSS editors. Some of this is specific
// to SASS
export class CSSEditor extends BaseContentEditor<postcss.Node> {

  @inject(DependenciesDependency.NS)
  private _dependencies: Dependencies;

  [SetRuleSelectorEditAction.SET_RULE_SELECTOR](node: postcss.Rule, { target, selector }: SetRuleSelectorEditAction) {
    const source = target.source;

    // prefix here is necessary
    const prefix = this.getRuleSelectorPrefix(node);
    node.selector = (node.selector.indexOf("&") === 0 ? "&" : "") + selector.replace(prefix, "");
  }

  [SetDeclarationEditAction.SET_DECLARATION](node: postcss.Rule, { target, name, newValue, newName }: SetDeclarationEditAction) {
    const source = target.source;

    const shouldAdd = node.walkDecls((decl, index) => {
      if (decl.prop === name) {
        if (newValue && newValue) {
          decl.prop = newName || name;
          decl.value = newValue;
        } else {
          node.nodes.splice(index, 1);
        }
        return false;
      }
    }) !== false;

    if (shouldAdd) {
      node.nodes.push(postcss.decl({ prop: name, value: newValue }))
    }
  }

  protected findTargetASTNode(root: postcss.Root, target: ISynthetic) {
    let found: postcss.Node;
    root.walk((node: postcss.Node, index: number) => {

      // find the starting point for the node
      if (node.type === target.source.kind && sourcePositionEquals(node.source.start, target.source.start)) {

        // next find the actual node that the synthetic matches with -- the source position may not be
        // entirely accurate for cases such as nested selectors.
        found = this.findNestedASTNode(<any>node, target);
        return false;
      }
    });
    return found;
  }

  private findNestedASTNode(node: postcss.Container, target: ISynthetic): postcss.Node {
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
    const selector = prefix + node.selector.replace(/^\&/, "");
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

  parseContent(filePath: string, content: string) {

    // TODO - find syntax based on mime type here
    return parseCSS(content, undefined, postcssSassSyntax);
  }

  getFormattedContent(root: postcss.Rule) {
    return root.toString();
  }
}

function isRuleNode(node: postcss.Node) {
  return node.type === "rule";
}