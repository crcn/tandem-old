import BaseExpression from './base';

module.exports = class RootExpression extends BaseExpression {
  constructor(childNodes) {
    super();
    this.childNodes = childNodes;
    this.ns = 'root';
  }
};
