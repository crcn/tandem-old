import { BaseExpression, ICursor } from '../core/expression';

/**
 *  JavaScript
 */


export const JS_REFERENCE = 'jsReference';
export class ReferenceExpression extends BaseExpression {
  constructor(public path:Array<string>, public position:ICursor) {
    super(JS_REFERENCE, position);
  }
}

export const JS_FUNCTION_CALL = 'jsFunctionCall';
export class FunctionCallExpression extends BaseExpression {
  constructor(public reference:ReferenceExpression, public parameters:Array<BaseExpression>, public position:ICursor) {
    super(JS_FUNCTION_CALL, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.reference._flattenDeep(items);
  }
}

export const JS_OPERATION = 'jsOperation';
export class OperationExpression extends BaseExpression {
  constructor(public operator:string, public left:BaseExpression, public right:BaseExpression, public position:ICursor) {
    super(JS_OPERATION, position);
  }
}

export const JS_LITERAL = 'jsLiteral';
export class LiteralExpression extends BaseExpression {
  constructor(public value:any, public position:ICursor) {
    super(JS_LITERAL, position);
  }
}

export const JS_NEGATIVE = 'jsNegative';
export class NegativeExpression extends BaseExpression {
  constructor(public value:BaseExpression, public position:ICursor) {
    super(JS_NEGATIVE, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.value._flattenDeep(items);
  }
}

export const JS_NOT = 'jsNot';
export class NotExpression extends BaseExpression {
  constructor(public value:BaseExpression, position:ICursor) {
    super(JS_NOT, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.value._flattenDeep(items);
  }
}

export const JS_TERNARY = 'jsTernary';
export class TernaryExpression extends BaseExpression {
  constructor(public condition:BaseExpression, public left:BaseExpression, public right:BaseExpression, public position:ICursor) {
    super(JS_TERNARY, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.condition._flattenDeep(items);
  }
}

export const JS_HASH = 'jsHash';
export class HashExpression extends BaseExpression {
  constructor(public values:any, public position:ICursor) {
    super(JS_HASH, position);
  }
}
