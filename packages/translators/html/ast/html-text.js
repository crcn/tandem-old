import Node from 'common/node';

class HtmlTextNode extends HtmlTextNode {
  constructor(sourceNode, value) {
    super(sourceNode, 'htmlText', { value: value });
  }
}

export default HtmlTextNode;
