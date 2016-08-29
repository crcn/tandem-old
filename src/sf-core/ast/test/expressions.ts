import { IRange } from "sf-core/geom";
import { IExpression, BaseExpression } from "../base";

export class Expression extends BaseExpression {
  constructor(position: IRange) {
    super(position);
  }
}

export class DeclarationExpression extends BaseExpression {
  constructor(readonly name: string, readonly value: Expression, position: IRange) {
    super(position);
  }
}

export class GroupExpression extends BaseExpression {
  constructor(readonly expresssions: Array<Expression>, position: IRange) {
    super(position);
  }
}

export class ReferenceExpression extends BaseExpression {
  constructor(readonly name: string, position: IRange) {
    super(position);
  }
}

export class NumberExpression extends BaseExpression {
  constructor(readonly value: number, position: IRange) {
    super(position);
  }
}

export class AssignmentExpression extends BaseExpression {
  constructor(readonly name: string, value: Expression, position: IRange) {
    super(position);
  }
}

export class FunctionCallExpression extends BaseExpression {
  constructor(readonly target: Expression, readonly parameters: Array<Expression>, position: IRange) {
    super(position);
  }
}
