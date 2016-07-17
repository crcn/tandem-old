import BaseExpression from './base';

module.exports = class ElementExpression extends BaseExpression {
  constructor(nodeName, attributes, childNodes) {
    super();
    this.ns         = 'element';
    this.nodeName   = nodeName;
    this.attributes = attributes;
    this.childNodes = childNodes;
  }
};
