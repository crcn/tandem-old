import BaseExpression from './base';

module.exports = class GroupExpression extends BaseExpression {
  constructor(childNodes) {
    super();
    this.childNodes = childNodes;
    this.ns = 'group';
  }
};
