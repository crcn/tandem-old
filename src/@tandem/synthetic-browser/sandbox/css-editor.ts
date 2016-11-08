import * as postcss from "postcss";
import { Action, inject, Injector, InjectorProvider, sourcePositionEquals, MimeTypeProvider } from "@tandem/common";
import {
  parseCSS,
  CSSSyntaxProvider,
  SyntheticCSSStyleRule,
  syntheticCSSRuleType,
  SyntheticCSSStyleSheetEdit,
  SyntheticCSSMediaRuleEdit,
  SyntheticCSSAtRuleEdit,
  SyntheticCSSAtRule,
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
export class CSSEditor extends BaseContentEditor<postcss.Node> {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  [SyntheticCSSStyleRuleEdit.SET_RULE_SELECTOR](node: postcss.Rule, { target, newValue }: SetValueEditActon) {
    const source = target.source;

    // prefix here is necessary
    const prefix = this.getRuleSelectorPrefix(node);
    node.selector = (node.selector.indexOf("&") === 0 ? "&" : "") + newValue.replace(prefix, "");
  }

  [SyntheticCSSStyleSheetEdit.REMOVE_STYLE_SHEET_RULE_EDIT](node: postcss.Container, { target, child }: RemoveChildEditAction) {
    const nodeChild = this.findTargetASTNode(node, <syntheticCSSRuleType>child);

    nodeChild.parent.removeChild(nodeChild);
  }

  [SyntheticCSSStyleSheetEdit.MOVE_STYLE_SHEET_RULE_EDIT](node: postcss.Container, { target, child, newIndex }: MoveChildEditAction) {
    const childNode = this.findTargetASTNode(node, <syntheticCSSRuleType>child);
    const parent = childNode.parent;
    parent.removeChild(childNode);
    parent.insertBefore(node.nodes[newIndex], childNode);
  }

  [SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT](node: postcss.Container, { target, child, index }: InsertChildEditAction) {

    let newChild = <syntheticCSSRuleType>child;

    node.append({
      rule(rule: SyntheticCSSStyleRule) {
        const ruleNode = postcss.rule({
          selector: rule.selector,
        });

        for (const key in rule.style.toObject()) {
          ruleNode.append(postcss.decl({
            prop: key,
            value: rule.style[key]
          }));
        }

        return ruleNode;
      },
      atrule(atrule: SyntheticCSSAtRule) {
        const ruleNode = postcss.atRule({
          name: atrule.atRuleName,
          params: atrule.params
        });

        for (const rule of atrule.cssRules) {
          ruleNode.append(this[rule.source.kind](rule));
        }

        return ruleNode;
      }
    }[newChild.source.kind](newChild));
  }


  [SyntheticCSSStyleRuleEdit.SET_DECLARATION](node: postcss.Rule, { target, name, newValue, oldName }: SetKeyValueEditAction) {
    const source = target.source;

    let found: boolean;
    const shouldAdd = node.walkDecls((decl, index) => {
      if (decl.prop === name || decl.prop === oldName) {
        if (name && newValue) {
          decl.prop  = name;
          decl.value = newValue;
        } else {
          node.removeChild(decl);
        }
        found = true;
      }
    });

    if (!found && newValue) {
      node.nodes.push(postcss.decl({ prop: name, value: newValue }))
    }
  }

  protected findTargetASTNode(root: postcss.Container, target: ISyntheticObject) {
    let found: postcss.Node;

    const walk = (node: postcss.Node, index: number) => {
      if (node.type === target.source.kind && sourcePositionEquals(node.source.start, target.source.start)) {

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
    return parseCSS(content, undefined, CSSSyntaxProvider.find(MimeTypeProvider.lookup(this.fileName, this._injector), this._injector), false);
  }

  getFormattedContent(root: postcss.Rule) {

    // try parsing again. This should throw an error if any edits are invalid.
    parseCSS(root.toString());

    return root.toString();
  }
}

function isRuleNode(node: postcss.Node) {
  return node.type === "rule";
}