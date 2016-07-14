import BaseExpression from './base';

module.exports = class TextExpression extends BaseExpression {
  constructor(nodeValue, location) {
    super();
    this.nodeValue = nodeValue;
    this.ns = 'text';
    this.location = location;
  }
}
