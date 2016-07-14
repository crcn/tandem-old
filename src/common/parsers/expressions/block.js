import BaseExpression from './base';

module.exports = class BlockExpression extends BaseExpression {
  constructor(script, location) {
    super();
    this.script = script;
    this.ns     = 'block';
    this.location = location;
  }
};
