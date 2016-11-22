import {
  RemoveMutation,
  SetValueMutation,
  sourcePositionEquals,
  MoveChildMutation,
  PropertyMutation,
  InsertChildMutation,
} from "@tandem/common";

import {
  BaseContentEditor,
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
  SyntheticDOMElementMutationTypes,
  SyntheticDOMContainerChangeTypes,
  SyntheticDOMValueNodeMutationTypes,
} from "@tandem/synthetic-browser";

export class MarkupEditor extends BaseContentEditor<MarkupExpression> {

  [RemoveMutation.REMOVE_CHANGE](node: MarkupNodeExpression, { target }: RemoveMutation<any>) {
    node.parent.removeChild(node);
  }

  [SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT](node: IMarkupValueNodeExpression, { target, newValue }: SetValueMutation<any>) {
    node.nodeValue = newValue;
  }

  [SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT](node: MarkupElementExpression, { target, name, newValue, oldName, newIndex }: PropertyMutation<any>) {

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

  [SyntheticDOMContainerChangeTypes.INSERT_CHILD_NODE_EDIT](node: MarkupElementExpression, { target, child, index }: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const childExpression = parseMarkup((<SyntheticDOMNode>child).toString());
    node.childNodes.splice(index, 0, childExpression);
  }

  [SyntheticDOMContainerChangeTypes.REMOVE_CHILD_NODE_EDIT](node: MarkupElementExpression, { target, child, index }: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode) as MarkupNodeExpression;
    node.childNodes.splice(node.childNodes.indexOf(childNode), 1);
  }

  [SyntheticDOMContainerChangeTypes.MOVE_CHILD_NODE_EDIT](node: MarkupElementExpression, { target, child, newIndex }: MoveChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
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
