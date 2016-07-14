import BaseExpression from './base';

module.exports = class CommentExpression extends BaseExpression {
  constructor(value, location) {
    super();
    this.value  = value;
    this.ns     = 'comment';
    this.location = location;
  }
}
