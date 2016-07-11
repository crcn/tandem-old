import create from 'common/utils/class/create';

export default class TextVNode {

  constructor(value) {
    this.nodeValue = String(value);
  }

  freezeNode(options) {
    var textNode = options.nodeFactory.createTextNode(this.nodeValue);
    return textNode;
  }

  static create = create;
}
