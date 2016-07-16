import BaseExpression from './base';

module.exports = class TextExpression extends BaseExpression {
  constructor(nodeValue) {
    super();
    this.nodeValue = nodeValue;
    this.ns = 'text';
  }
};
