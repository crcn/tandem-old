import { BaseContentEditor, RemoveEditAction, SetKeyValueEditAction } from "@tandem/sandbox";
import { sourcePositionEquals } from "@tandem/common";
import {
  parseMarkup,
  MarkupExpression,
  SyntheticDOMNode,
  SyntheticDOMElementEdit,
  findMarkupExpression,
  SyntheticDOMElement,
  MarkupNodeExpression,
  MarkupElementExpression,
  formatMarkupExpression,
  MarkupFragmentExpression,
} from "@tandem/synthetic-browser";

export class MarkupEditor extends BaseContentEditor<MarkupExpression> {

  [RemoveEditAction.REMOVE_EDIT](node: MarkupNodeExpression, { target }: RemoveEditAction) {
    node.parent.removeChild(node);
  }

  [SyntheticDOMElementEdit.SET_ELEMENT_ATTRIBUTE_EDIT](element: MarkupElementExpression, { target, name, newValue, newName }: SetKeyValueEditAction) {
    element.setAttribute(newName || name, newValue);
    if (newName) {
      element.removeAttribute(newName);
    }
  }

  findTargetASTNode(root: MarkupFragmentExpression, synthetic: SyntheticDOMNode) {
    return findMarkupExpression(root, (expression) => {
      return expression.kind === synthetic.source.kind && sourcePositionEquals(expression.location.start, synthetic.source.start)
    });
  }

  parseContent(content: string) {
    return parseMarkup(content);
  }

  getFormattedContent(root: MarkupFragmentExpression) {
    return formatMarkupExpression(root);
  }
}
