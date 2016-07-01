import IExpression from './iexpression';

export default class BaseExpression implements IExpression {
  public walk(iterator:Function):void {
    iterator(this);
  }
}
