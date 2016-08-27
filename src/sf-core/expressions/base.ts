import { IRange } from "sf-core/geom";

export interface IExpression {
  position: IRange;
}

export abstract class BaseExpression implements IExpression {
  constructor(public position: IRange) { }
}