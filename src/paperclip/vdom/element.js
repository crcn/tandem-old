import create from 'common/class/utils/create';

export default class ElementVNode {

  constructor(name, attributes, children) {
    this.nodeName   = name;
    this.attributes = attributes;
    this.childNodes = children;
  }

  freeze(options) {
    var node = document.createElement(this.nodeName);

    // todo - check for script attributes
    for (var key in this.attributes) {
      node.setAttribute(key, this.attributes[key]);
    }

    for (var childNode of this.childNodes) {
      node.appendChild(childNode.freeze(options));
    }

    return node;
  }

  static create = create;
}
