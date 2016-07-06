import Node from './base';

export default class TextNode extends Node {
  constructor(nodeValue) {
    super();
    this.nodeValue = nodeValue;
  }

  flatten(nodes = []) {
    nodes.push(this);
    return nodes;
  }
}
