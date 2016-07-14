import BaseExpression from './base';

module.exports = class AttributeExpression extends BaseExpression {
  constructor(key, value, location) {
    super();
    this.key   = key;
    this.value = value;
    this.ns    = 'attribute';
    this.location = location;
  }
}
