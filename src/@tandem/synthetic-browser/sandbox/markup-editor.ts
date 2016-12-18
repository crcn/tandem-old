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

import parse5 = require("parse5");

import {
  SyntheticDOMNode,
  SyntheticDOMElement,
  getHTMLASTNodeLocation,
  SyntheticHTMLElement,
  findDOMNodeExpression,
  filterDOMNodeExpressions,
  formatMarkupExpression,
  SyntheticDOMElementEdit,
  SyntheticDOMValueNodeEdit,
  SyntheticDOMContainerEdit,
  SyntheticDOMElementMutationTypes,
  SyntheticDOMContainerMutationTypes,
  SyntheticDOMValueNodeMutationTypes,
  ElementTextContentMimeTypeProvider,
} from "@tandem/synthetic-browser";

// TODO - replace text instead of modifying the AST
export class MarkupEditor extends BaseContentEditor<parse5.AST.Default.Node> {

  [RemoveMutation.REMOVE_CHANGE](node: parse5.AST.Default.Element, { target }: RemoveMutation<any>) {
    const index = node.parentNode.childNodes.indexOf(node);
    if (index !== -1) {
      node.parentNode.childNodes.splice(index, 1);
    }
  }

  // compatible with command & value node
  [SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT](node: any, { target, newValue }: SetValueMutation<any>) {
    node.value = node.data = newValue;
  }

  [SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT](node: parse5.AST.Default.Element, { target, name, newValue, oldName, index }: PropertyMutation<any>) {
    
    // let attribute: MarkupAttributeExpression;
    // let i = 0;

    // for (;i < this.attributes.length; i++) {
    //   attribute = this.attributes[i];
    //   if (attribute.name === name) {
    //     attribute.value = newValue;
    //     break;
    //   }
    // }

    // if (i === this.attributes.length) {
    //   this.attributes.push(attribute = new MarkupAttributeExpression(name, newValue, null));
    // }

    // if (newIndex != null && newIndex !== i) {
    //   this.attributes.splice(i, 1);
    //   this.attributes.splice(newIndex, 0, attribute);
    // }
    
    const syntheticElement = <SyntheticHTMLElement>target;
    let found;
    for (let i = node.attrs.length; i--;) {
      const attr = node.attrs[i];
      if (attr.name === name) {
        found = true;
        if (newValue == null) {
          node.attrs.splice(i, 1);
        } else {
          attr.value = newValue;
          if (i !== index) {
            node.attrs.splice(i, 1);
            node.attrs.splice(index, 0, attr);
          }
        }
        break;
      }
    }

    if (!found) {
      node.attrs.splice(index, 0, { name, value: newValue });
    }

    if (oldName) {
      for (let i = node.attrs.length; i--;) {
        const attr = node.attrs[i];
        if (attr.name === name) {
          node.attrs.splice(i, 1);
        }
      }
    }
  }

  [SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT](node: parse5.AST.Default.Element, { target, child, index }: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const childExpression = parse5.parseFragment((<SyntheticDOMNode>child).toString(), { locationInfo: true }) as any;
    node.childNodes.splice(index, 0, childExpression);
  }

  [SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT](node: parse5.AST.Default.Element, { target, child, index }: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode);
    node.childNodes.splice(node.childNodes.indexOf(childNode), 1);
  }

  [SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT](node: parse5.AST.Default.Element, { target, child, index }: MoveChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode);
    node.childNodes.splice(node.childNodes.indexOf(childNode), 1);
    node.childNodes.splice(index, 0, childNode);
  }

  findTargetASTNode(root: parse5.AST.Default.Node, synthetic: SyntheticDOMNode) {
    return findDOMNodeExpression(root, (expression) => {
      const location = getHTMLASTNodeLocation(expression);
      return /*expression.kind === synthetic.source.kind &&*/ sourcePositionEquals(location, synthetic.source.start)
    });
  }

  protected handleUnknownMutation(mutation: Mutation<ISyntheticObject>) {

    const mstart = mutation.target.source.start;

    // for now just support text nodes. However, attributes may need to be implemented here in thre future
    const matchingTextNode = filterDOMNodeExpressions(this._rootASTNode, (expression) => {
      const eloc = getHTMLASTNodeLocation(expression);
      
      // may be new -- ignore if there is no location 
      if (!eloc) return false;

      //  && 
        // (mstart.line < eloc.end.line || (mstart.line === eloc.end.line && mstart.column <= eloc.end.column)
      return (mstart.line > eloc.line || (mstart.line === eloc.line && mstart.column >= eloc.column)); 
    }).pop() as parse5.AST.Default.TextNode;

    if (!matchingTextNode || matchingTextNode.nodeName !== "#text") {
      return super.handleUnknownMutation(mutation);
    }

    if (!matchingTextNode.parentNode) return super.handleUnknownMutation(mutation);

    const element = matchingTextNode.parentNode as parse5.AST.Default.Element;
    const contentMimeType = ElementTextContentMimeTypeProvider.lookup(element, this.kernel);
  
    if (!contentMimeType) return super.handleUnknownMutation(mutation);

    const editorProvider = ContentEditorFactoryProvider.find(contentMimeType, this.kernel);
    if (!editorProvider) {
      return this.logger.error(`Cannot edit ${element.nodeName}:${contentMimeType} element text content.`);
    }

    const nodeLocation = getHTMLASTNodeLocation(matchingTextNode);

    // need to add whitespace before the text node since the editor needs the proper line number in order to apply the
    // mutation. The column number should match.
    const lines = Array.from({ length: nodeLocation.line - 1 }).map(() => "\n").join("");

    const newTextContent = editorProvider.create(this.uri, lines + matchingTextNode.value).applyMutations([mutation]);

    matchingTextNode.value = newTextContent;
  }

  parseContent(content: string) {
    return parse5.parse(content, { locationInfo: true }) as any;
  }

  getFormattedContent(root: parse5.AST.Default.Node) {
    return formatMarkupExpression(root);
  }
}
