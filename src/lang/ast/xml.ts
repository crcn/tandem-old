import BaseExpression from './base';
import IExpression from './iexpression';

export class AttributeExpression extends BaseExpression {

  public name:string;
  public value:any;

  constructor(name:string, value:any = undefined) {
    super();
    this.name = name;
    this.value = value;
  }
}

export class ElementExpression extends BaseExpression {

  public name:string;
  public attributes:Array<AttributeExpression>;
  public children:Array<IExpression>;

  constructor(name:string, attributes:Array<AttributeExpression> = [], children:Array<IExpression> = []) {
    super();
    this.name = name;
    this.attributes = attributes;
    this.children   = children;
  }
}

export class CommentExpression extends BaseExpression {
  public value:string;
  constructor(value:string) {
    super();
    this.value = value;
  }
}

export class BlockExpression extends BaseExpression {

  public script:IExpression;

  constructor(script:IExpression) {
    super();
    this.script = script;
  }

  public walk(iterator:Function):void {
    super.walk(iterator);
    this.script.walk(iterator);
  }
}

export class TextExpression extends BaseExpression {
  public value:string;
  constructor(value:string) {
    super();
    this.value = value;
  }
}

export class DocTypeExpression extends BaseExpression {
  public value:string;
  constructor(value:string) {
    super();
    this.value = value;
  }
}

export class ScriptExpression extends BaseExpression {
  public value:IExpression;
  constructor(value:IExpression) {
    super();
    this.value = value;
  }
  public walk(iterator:Function):void {
    super.walk(iterator);
    this.value.walk(iterator);
  }
}
