import Node from 'common/node';

class HtmlNode extends Node {
  constructor(sourceNode, type, properties, children) {
    super({ sourceNode: sourceNode, type: type, ...properties }, children);
  }
}

export default HtmlNode;
