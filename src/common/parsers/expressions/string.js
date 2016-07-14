import BaseExpression from './base';

module.exports = class StringExpression extends BaseExpression {
  constructor(value) {
    super();
    this.value = value;
    this.ns = 'string';
  }
};
