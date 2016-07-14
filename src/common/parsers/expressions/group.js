import BaseExpression from './base';

module.exports = class GroupExpression extends BaseExpression {
  constructor(childNodes, location) {
    super();
    this.childNodes = childNodes;
    this.ns = 'group';
    this.location = location;
  }
};
