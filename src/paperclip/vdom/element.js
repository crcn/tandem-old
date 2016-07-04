import create from 'common/class/utils/create';

export default class ElementVNode {

  constructor(name, attributes, childNodes) {
    this.nodeName   = name;
    this.attributes = attributes;
    this.childNodes = childNodes || [];
  }

  freeze(options) {
    var node = options.nodeFactory.createElement(this.nodeName);

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
