import create from 'common/class/utils/create';

export default class TextVNode {

  constructor(value) {
    this.nodeValue = String(value);
  }

  freeze(options) {
    var textNode = options.nodeFactory.createTextNode(this.nodeValue);
    return textNode;
  }

  static create = create;
}
