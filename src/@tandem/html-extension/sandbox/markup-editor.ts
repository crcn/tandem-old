import { IContentEditor, BaseContentEditor } from "@tandem/sandbox";
import {
  parseMarkup,
  MarkupExpression,
  SyntheticDOMNode,
  formatMarkupExpression,
  MarkupFragmentExpression,
} from "@tandem/synthetic-browser";

export class MarkupEditor extends BaseContentEditor<MarkupExpression> {
  findTargetASTNode(root: MarkupFragmentExpression, synthetic: SyntheticDOMNode) {
    return root;
  }
  parseContent(content: string) {
    return parseMarkup(content);
  }
  getFormattedContent(root: MarkupFragmentExpression) {
    return formatMarkupExpression(root);
  }
}
