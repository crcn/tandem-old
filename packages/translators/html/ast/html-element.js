import HtmlNode from './html-node';

class HtmlElementNode extends HtmlNode {
  constructor(sourceNode, name, attributes, children) {
    super(sourceNode, 'htmlElement', { name: name, attributes: { style: {}, ...attributes }}, children);
  }
}

export default HtmlElementNode;
