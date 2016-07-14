import BaseExpression from './base';

module.exports = class RootExpression extends BaseExpression {
  constructor(childNodes, location) {
    super();
    this.childNodes = childNodes;
    this.ns = 'root';
    this.location = location;
  }
}
