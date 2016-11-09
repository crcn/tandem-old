import { sourcePositionEquals } from "@tandem/common";

import {
  RemoveEditAction,
  SetValueEditActon,
  BaseContentEditor,
  MoveChildEditAction,
  SetKeyValueEditAction,
  InsertChildEditAction,
} from "@tandem/sandbox";

import {
  parseMarkup,
  MarkupExpression,
  SyntheticDOMNode,
  SyntheticDOMElement,
  SyntheticHTMLElement,
  findMarkupExpression,
  MarkupNodeExpression,
  formatMarkupExpression,
  SyntheticDOMElementEdit,
  MarkupElementExpression,
  MarkupFragmentExpression,
  SyntheticDOMValueNodeEdit,
  SyntheticDOMContainerEdit,
  IMarkupValueNodeExpression,
} from "@tandem/synthetic-browser";

export class MarkupEditor extends BaseContentEditor<MarkupExpression> {

  [RemoveEditAction.REMOVE_EDIT](node: MarkupNodeExpression, { target }: RemoveEditAction) {
    node.parent.removeChild(node);
  }

  [SyntheticDOMValueNodeEdit.SET_VALUE_NODE_EDIT](node: IMarkupValueNodeExpression, { target, newValue }: SetValueEditActon) {
    node.nodeValue = newValue;
  }

  [SyntheticDOMElementEdit.SET_ELEMENT_ATTRIBUTE_EDIT](node: MarkupElementExpression, { target, name, newValue, oldName, newIndex }: SetKeyValueEditAction) {

    const syntheticElement = <SyntheticHTMLElement>target;
    if (newValue == null) {
      node.removeAttribute(name);
    } else {
      node.setAttribute(name, newValue, newIndex);
    }

    if (oldName) {
      node.removeAttribute(oldName);
    }
  }

  [SyntheticDOMContainerEdit.INSERT_CHILD_NODE_EDIT](node: MarkupElementExpression, { target, child, index }: InsertChildEditAction) {
    const childExpression = parseMarkup((<SyntheticDOMNode>child).toString());
    node.childNodes.splice(index, 0, childExpression);
  }

  [SyntheticDOMContainerEdit.REMOVE_CHILD_NODE_EDIT](node: MarkupElementExpression, { target, child, index }: InsertChildEditAction) {
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode) as MarkupNodeExpression;
    node.childNodes.splice(node.childNodes.indexOf(childNode), 1);
  }

  [SyntheticDOMContainerEdit.MOVE_CHILD_NODE_EDIT](node: MarkupElementExpression, { target, child, newIndex }: MoveChildEditAction) {
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode) as MarkupNodeExpression;
    node.childNodes.splice(node.childNodes.indexOf(childNode), 1);
    node.childNodes.splice(newIndex, 0, childNode);
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
