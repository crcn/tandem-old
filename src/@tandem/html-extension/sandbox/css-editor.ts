import * as postcss from "postcss";
import { Action, inject, Dependencies, DependenciesDependency, sourcePositionEquals } from "@tandem/common";
import { SyntheticCSSStyleRule, SetRuleSelectorEditAction, parseCSS, SetDeclarationEditAction } from "@tandem/synthetic-browser";
import { IContentEditor, BaseContentEditor, IFileEdit, BaseFileEdit, Bundle, loadBundleContent, ISynthetic } from "@tandem/sandbox";

export class CSSEditor extends BaseContentEditor<postcss.Node> {

  @inject(DependenciesDependency.NS)
  private _dependencies: Dependencies;

  [SetRuleSelectorEditAction.SET_RULE_SELECTOR](node: postcss.Rule, { targetSythetic, selector }: SetRuleSelectorEditAction) {
    const source = targetSythetic.source;
    node.selector = selector;
  }

  [SetDeclarationEditAction.SET_DECLARATION](node: postcss.Rule, { targetSythetic, name, newValue, newName }: SetDeclarationEditAction) {
    const source = targetSythetic.source;
    console.log("SET DECL");
  }

  findTargetASTNode(root: postcss.Root, { source }: ISynthetic) {
    let found: postcss.Node;
    root.walk((node: postcss.Node, index: number) => {
      if (node.type === source.kind && sourcePositionEquals(node.source.start, source.start)) {
        found = node;
        return false;
      }
    });
    return found;
  }

  parseContent(filePath: string, content: string) {
    return parseCSS(content);
  }

  getFormattedContent(root: postcss.Rule) {
    return root.toString();
  }
}