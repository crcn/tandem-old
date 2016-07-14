import BaseExpression from './base';

module.exports = class NumberExpression extends BaseExpression {
  constructor(value) {
    super(value);
    this.value = value;
    this.ns = 'number';
  }
}
