import BaseExpression from './base';

module.exports = class ReferenceExpression extends BaseExpression {
  constructor(path) {
    super();
    this.ns = 'reference';
    this.path = path;
  }
};
