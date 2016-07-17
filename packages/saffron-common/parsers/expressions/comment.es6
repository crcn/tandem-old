import BaseExpression from './base';

module.exports = class CommentExpression extends BaseExpression {
  constructor(value) {
    super();
    this.value  = value;
    this.ns     = 'comment';
  }
};
