import { IContentEditor, BaseContentEditor, RemoveEditAction } from "@tandem/sandbox";
import { sourcePositionEquals } from "@tandem/common";
import {
  parseMarkup,
  MarkupExpression,
  SyntheticDOMNode,
  SetElementAttributeEditAction,
  findMarkupExpression,
  SyntheticDOMElement,
  MarkupNodeExpression,
  MarkupElementExpression,
  formatMarkupExpression,
  MarkupFragmentExpression,
} from "@tandem/synthetic-browser";

export class MarkupEditor2 extends BaseContentEditor<MarkupExpression> {

  [RemoveEditAction.REMOVE_EDIT](node: MarkupNodeExpression, { target }: RemoveEditAction) {
    node.parent.removeChild(node);
  }

  [SetElementAttributeEditAction.SET_ELEMENT_ATTRIBUTE_EDIT](element: MarkupElementExpression, { target, attributeName, newAttributeName, newAttributeValue }: SetElementAttributeEditAction) {
    element.setAttribute(newAttributeName || attributeName, newAttributeValue);
    if (newAttributeName) {
      element.removeAttribute(attributeName);
    }
  }

  findTargetASTNode(root: MarkupFragmentExpression, synthetic: SyntheticDOMNode) {
    return findMarkupExpression(root, (expression) => {
      return expression.kind === synthetic.source.kind && sourcePositionEquals(expression.location.start, synthetic.source.start)
    });
  }

  parseContent(filePath: string, content: string) {
    return parseMarkup(content);
  }

  getFormattedContent(root: MarkupFragmentExpression) {
    return formatMarkupExpression(root);
  }
}
