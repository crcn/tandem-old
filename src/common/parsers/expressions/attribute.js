import BaseExpression from './base';

module.exports = class AttributeExpression extends BaseExpression {
  constructor(key, value) {
    super();
    this.key   = key;
    this.value = value;
    this.ns    = 'attribute';
  }
};
