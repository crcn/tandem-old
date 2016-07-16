import BaseExpression from './base';

module.exports = class BlockExpression extends BaseExpression {
  constructor(script) {
    super();
    this.script = script;
    this.ns     = 'block';
  }
};
