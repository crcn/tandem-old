import { INode, ITextNode, IElement, ICommentNode  } from './base';

export default function diff(left:INode, right:INode) {

}

export class NodeChange<T> {
  constructor() {

  }
}

export class TextChange extends NodeChange<ITextNode> {
  // constructor()
}