import BaseExpression from './base';
import IExpression from './iexpression';

function _walkArray(iterator:Function, items:Array<IExpression>) {
  items.forEach(function(expression:IExpression) {
    expression.walk(iterator);
  })
}

export class PathExpression  extends BaseExpression {

  public path:Array<IExpression>;

  constructor(...path:Array<IExpression>) {
    super();
    this.path = path;
  }

  walk(iterator:Function) {
    super.walk(iterator);
    _walkArray(iterator, this.path);
  }

  toString() {
    return this.path.join('.');
  }
}

export class ReferenceExpression extends BaseExpression {

  public name:string;

  constructor(name:string) {
    super();
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

export class CallExpression extends BaseExpression {
  public reference:IExpression;
  public parameters:Array<IExpression>;

  constructor(reference:IExpression, parameters:Array<IExpression> = []) {
    super();
    this.reference = reference;
    this.parameters = parameters;
  }

  toString() {
    return this.reference + '(' + this.parameters.join(',') + ')';
  }
}

export class StringExpression extends BaseExpression {
  public value:string;
  constructor(value:string) {
    super();
    this.value = value;
  }

  toString() {
    return "'" + this.value.replace(/'/g,'\\').replace(/\n/g, '\\n') + "'";
  }
}

export class GroupExpression extends BaseExpression {

  public children:Array<IExpression>;

  constructor(...children:Array<IExpression>) {
    super();
    this.children = children;
  }

  walk(iterator:Function) {
    super.walk(iterator);
    _walkArray(iterator, this.children);
  }

  toString() {
    return this.children.join(';\n');
  }
}

export class FunctionCallExpression extends BaseExpression {

  public reference:IExpression;
  public parameterValues:Array<IExpression>;

  constructor(reference:IExpression, ...parameterValues:Array<IExpression>) {
    super();
    this.reference       = reference;
    this.parameterValues = parameterValues;
  }

  public walk(iterator:Function) {
    super.walk(iterator);
    this.reference.walk(iterator);
    _walkArray(iterator, this.parameterValues);
  }

  public toString() {
    return `${this.reference}(${this.parameterValues.join(',')})`;
  }
}

export class AssignExpression extends BaseExpression {
  public left:IExpression;
  public right:IExpression;

  constructor(left:IExpression, right:IExpression) {
    super();
    this.left = left;
    this.right = right;
  }

  public walk(iterator:Function) {
    super.walk(iterator);
    this.left.walk(iterator);
    this.right.walk(iterator);
  }

  public toString() {
    return `${this.left}=${this.right}`;
  }
}

export class VarExpression extends BaseExpression {
  public name:string;

  constructor(name:string) {
    super();
    this.name  = name;
  }

  toString() {
    return `var ${this.name}`;
  }
}

export class StatementExpression extends BaseExpression {

    public value:IExpression;
    
    constructor(value:IExpression) {
      super();
      this.value = value;
    }

    toString() {
      return `${this.value};`;
    }
}

export class ImportExpression extends BaseExpression {

  public decl:IExpression;
  public source:IExpression;

  constructor(decl:IExpression, source:IExpression) {
    super();
    this.decl = decl;
    this.source = source;
  }

  public walk(iterator:Function) {
    super.walk(iterator);
    this.decl.walk(iterator);
    this.source.walk(iterator);
  }

  toString() {
    return ['import', this.decl, 'from', this.source].join(' ');
  }
}

export class ArrayExpression extends BaseExpression {

  public values:Array<IExpression>;

  constructor(...values:Array<IExpression>) {
    super();
    this.values = values;
  }

  public walk(iterator:Function):void {
    super.walk(iterator);
    _walkArray(iterator, this.values);
  }

  toString() {
    return `[${this.values.join(',')}]`;
  }
}

export class ExportExpression extends BaseExpression {
  public name:string;
  public value:IExpression;

  constructor(name:string, value:IExpression) {
    super();
    this.name = name;
    this.value = value;
  }

  public walk(iterator:Function):void {
    super.walk(iterator);
    this.value.walk(iterator);
  }
}

export class FunctionExpression extends BaseExpression {

  public name:string;
  public parameters:Array<ParameterExpression>;
  public body:BodyExpression;

  constructor(name:string, parameters:Array<ParameterExpression>, body:BodyExpression) {
    super();
    this.name       = name;
    this.parameters = parameters;
    this.body       = body;
  }

  public walk(iterator:Function):void {
    super.walk(iterator);
    _walkArray(iterator, this.parameters);
    this.body.walk(iterator);
  }

  toString() {
    var buffer = ['function'];

    if (this.name) buffer.push(' ', this.name);
    buffer.push('(' + (this.parameters || []).join(',') + ')');
    buffer.push(this.body ? this.body.toString() : '{}');
    return buffer.join('');
  }
}

export class ParameterExpression extends BaseExpression {

  public name:string;
  public defaultValue:IExpression;

  constructor(name:string, defaultValue:IExpression = void 0) {
    super();
    this.name         = name;
    this.defaultValue = defaultValue;
  }

  public walk(iterator:Function):void {
    super.walk(iterator);
    this.defaultValue.walk(iterator);
  }
};

export class NullExpression extends BaseExpression {
  toString() {
    return 'null';
  }
}

export class UndefinedExpression extends BaseExpression {
  toString() {
    return 'undefined';
  }
}

export class BooleanExpression extends BaseExpression {

  public value:Boolean;

  constructor(value:Boolean) {
    super();
    this.value = !!value;
  }

  toString() {
    return String(this.value);
  }
}

export class NumberExpression extends BaseExpression {
  public value:number;

  constructor(value:number) {
    super();
    this.value = value;
  }
  toString() {
    return this.value;
  }
};

export class InfinityExpression extends BaseExpression {
  toString() {
    return 'Infinity';
  }
}

export class NaNExpression extends BaseExpression {
  toString() {
    return 'NaN';
  }
}

export class CommentExpression extends BaseExpression {

  public value:string;

  constructor(value:string) {
    super();
    this.value = value;
  }

  toString() {
    return `/* ${this.value} */`;
  }
}

export class BodyExpression extends BaseExpression {
  public children:Array<IExpression>;

  constructor(...children:Array<IExpression>) {
    super();
    this.children = children;
  }

  public walk(iterator:Function):void {
    super.walk(iterator);
    _walkArray(iterator, this.children);
  }

  toString() {
    return `{${this.children.join(' ')}}`;
  }
}

export class ClassExpression extends BaseExpression {

  public name:string;
  public extend:IExpression;
  public properties:Array<IExpression>;

  constructor(name:string, extend:IExpression, ...properties:Array<IExpression>) {
    super();
    this.name       = name;
    this.extend     = extend;
    this.properties = properties;
  }

  public walk(iterator:Function):void {
    super.walk(iterator);
    this.extend.walk(iterator);
    _walkArray(iterator, this.properties);
  }

  toString() {
    var buffer = ['class', this.name];
    if (this.extend) buffer.push('extends', this.extend.toString());
    buffer.push('{', this.properties.join('\n'), '}');

    return buffer.join(' ');
  }
}

export class ClassFunctionExpression extends BaseExpression {

  public name:string;
  public parameters:Array<ParameterExpression>;
  public body:BodyExpression;

  constructor(name:string, parameters:Array<ParameterExpression>, body:BodyExpression) {
    super();
    this.name = name;
    this.parameters = parameters;
    this.body = body;
  }

  public walk(iterator:Function):void {
    super.walk(iterator);
    _walkArray(iterator, this.parameters);
    this.body.walk(iterator);
  }

  toString() {
    return [this.name, `(${this.parameters})`, this.body].join('');
  }
}
