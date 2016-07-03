import create from 'common/class/utils/create';

export default class TextVNode {

  constructor(value) {
    this.nodeValue = value;
  }

  freeze(options) {
    var textNode = document.createTextNode(this.nodeValue);
    return textNode;
  }

  static create = create;
}
