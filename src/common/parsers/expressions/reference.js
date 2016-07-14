import BaseExpression from './base';

module.exports = class ReferenceExpression extends BaseExpression {
  constructor(path, location) {
    super();
    this.ns = 'reference';
    this.path = path;
    this.location = location;
  }
}
