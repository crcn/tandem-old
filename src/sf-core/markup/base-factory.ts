import { ITextNode, ICommentNode, IElement, IContainerNode } from './base';

// based off of the DOM

export interface INodeFactory {
  createElement(nodeName:string):IElement;
  createComment(nodeValue:string):ICommentNode;
  createTextNode(nodeValue:string):ITextNode;
  createDocumentFragment():IContainerNode;
}