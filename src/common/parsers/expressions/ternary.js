import BaseExpression from './base';

module.exports = class TernaryExpression extends BaseExpression {
  constructor(condition, left, right) {
    super();
    this.ns = 'ternary';
    this.condition = condition;
    this.left = left;
    this.right = right;
  }
}
