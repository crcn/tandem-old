import { IRange } from "sf-core/geom";
import { BaseExpression } from "sf-core/expressions";

/**
 *  JavaScript
 */

export class ReferenceExpression extends BaseExpression {
  constructor(public path:Array<string>, public position:IRange) {
    super(position);
  }
}


export class FunctionCallExpression extends BaseExpression {
  constructor(public reference:ReferenceExpression, public parameters:Array<BaseExpression>, public position:IRange) {
    super(position);
  }
}


export class OperationExpression extends BaseExpression {
  constructor(public operator:string, public left:BaseExpression, public right:BaseExpression, public position:IRange) {
    super(position);
  }
}


export class LiteralExpression extends BaseExpression {
  constructor(public value:any, public position:IRange) {
    super(position);
  }
}


export class NegativeExpression extends BaseExpression {
  constructor(public value:BaseExpression, public position:IRange) {
    super(position);
  }
}


export class NotExpression extends BaseExpression {
  constructor(public value:BaseExpression, position:IRange) {
    super(position);
  }
}


export class TernaryExpression extends BaseExpression {
  constructor(public condition:BaseExpression, public left:BaseExpression, public right:BaseExpression, public position:IRange) {
    super(position);
  }
}


export class HashExpression extends BaseExpression {
  constructor(public values:any, public position:IRange) {
    super(position);
  }
}
