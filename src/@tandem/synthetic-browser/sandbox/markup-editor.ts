import {
  Mutation,
  RemoveMutation,
  SetValueMutation,
  PropertyMutation,
  MoveChildMutation,
  InsertChildMutation,
  sourcePositionEquals,
} from "@tandem/common";

import {
  ISyntheticObject,
  BaseContentEditor,
  ContentEditorFactoryProvider,
} from "@tandem/sandbox";

import {
  parseMarkup,
  MarkupExpression,
  SyntheticDOMNode,
  SyntheticDOMElement,
  MarkupExpressionKind,
  SyntheticHTMLElement,
  findMarkupExpression,
  
  fitlerMarkupExpressions,
  MarkupNodeExpression,
  MarkupTextExpression,
  formatMarkupExpression,
  SyntheticDOMElementEdit,
  MarkupElementExpression,
  MarkupFragmentExpression,
  SyntheticDOMValueNodeEdit,
  SyntheticDOMContainerEdit,
  IMarkupValueNodeExpression,
  SyntheticDOMElementMutationTypes,
  SyntheticDOMContainerMutationTypes,
  SyntheticDOMValueNodeMutationTypes,
  ElementTextContentMimeTypeProvider,
} from "@tandem/synthetic-browser";

// TODO - replace text instead of modifying the AST
export class MarkupEditor extends BaseContentEditor<MarkupExpression> {

  [RemoveMutation.REMOVE_CHANGE](node: MarkupNodeExpression, { target }: RemoveMutation<any>) {
    node.parent.removeChild(node);
  }

  [SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT](node: IMarkupValueNodeExpression, { target, newValue }: SetValueMutation<any>) {
    node.nodeValue = newValue;
  }

  [SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT](node: MarkupElementExpression, { target, name, newValue, oldName, index }: PropertyMutation<any>) {

    const syntheticElement = <SyntheticHTMLElement>target;
    if (newValue == null) {
      node.removeAttribute(name);
    } else {
      node.setAttribute(name, newValue, index);
    }

    if (oldName) {
      node.removeAttribute(oldName);
    }
  }

  [SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT](node: MarkupElementExpression, { target, child, index }: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const childExpression = parseMarkup((<SyntheticDOMNode>child).toString());
    node.childNodes.splice(index, 0, childExpression);
  }

  [SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT](node: MarkupElementExpression, { target, child, index }: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode) as MarkupNodeExpression;
    node.childNodes.splice(node.childNodes.indexOf(childNode), 1);
  }

  [SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT](node: MarkupElementExpression, { target, child, index }: MoveChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode) as MarkupNodeExpression;
    node.childNodes.splice(node.childNodes.indexOf(childNode), 1);
    node.childNodes.splice(index, 0, childNode);
  }

  findTargetASTNode(root: MarkupFragmentExpression, synthetic: SyntheticDOMNode) {
    return findMarkupExpression(root, (expression) => {
      return expression.kind === synthetic.source.kind && sourcePositionEquals(expression.location.start, synthetic.source.start)
    });
  }

  protected handleUnknownMutation(mutation: Mutation<ISyntheticObject>) {

    const mstart = mutation.target.source.start;

    // for now just support text nodes. However, attributes may need to be implemented here in thre future
    const matchingTextNode = fitlerMarkupExpressions(this._rootASTNode, (expression) => {
      const eloc = expression.location;
      
      // may be new -- ignore if there is no location 
      if (!eloc) return false;
      
      return (mstart.line > eloc.start.line || (mstart.line === eloc.start.line && mstart.column >= eloc.start.column)) && 
        (mstart.line < eloc.end.line || (mstart.line === eloc.end.line && mstart.column <= eloc.end.column)); 
    }).pop() as MarkupTextExpression;

    if (!matchingTextNode || matchingTextNode.kind !== MarkupExpressionKind.TEXT) {
      return super.handleUnknownMutation(mutation);
    }

    if (!matchingTextNode.parent) return super.handleUnknownMutation(mutation);

    const element = matchingTextNode.parent as MarkupElementExpression;
    const contentMimeType = ElementTextContentMimeTypeProvider.lookup(element, this.injector);
  
    if (!contentMimeType) return super.handleUnknownMutation(mutation);

    const editorProvider = ContentEditorFactoryProvider.find(contentMimeType, this.injector);
    if (!editorProvider) {
      return this.logger.error(`Cannot edit ${element.nodeName}:${contentMimeType} element text content.`);
    }

    // need to add whitespace before the text node since the editor needs the proper line number in order to apply the
    // mutation. The column number should match.
    const lines = Array.from({ length: matchingTextNode.location.start.line - 1 }).map(() => "\n").join("");

    // console.log(matchingTextNode.location.start);

    // console.log(lines.length, "LINES", JSON.stringify(matchingTextNode.nodeValue), mutation.target.source);

    const newTextContent = editorProvider.create(this.uri, lines + matchingTextNode.nodeValue).applyMutations([mutation]);

    
    matchingTextNode.nodeValue = newTextContent;
  }

  parseContent(content: string) {
    return parseMarkup(content);
  }

  getFormattedContent(root: MarkupFragmentExpression) {
    return formatMarkupExpression(root);
  }
}
