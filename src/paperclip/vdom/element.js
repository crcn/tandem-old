import create from 'common/class/utils/create';

export default class ElementVNode {

  constructor(name, attributes, children) {
    this.nodeName   = name;
    this.attributes = attributes;
    this.childNodes = children;
  }

  freeze(options) {
    var element = document.createElement(this.nodeName);

    for (var key in this.attributes) {
      div.setAttribute(key, this.attributes[key]);
    }
    for (var childNode of this.childNodes) {
      div.appendChild(childNode.freeze(options));
    }

    return element;
  }

  static create = create;
}
