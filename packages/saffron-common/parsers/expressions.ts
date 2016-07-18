

class BaseExpression {
  constructor(public ns:string) { }

  createEntity(properties:any) {
    var fragment:any = properties.fragments.query(`entities/${this.ns}`);
    
    if (!fragment) {
      throw new Error(`entity fragment "${this.ns}" does not exist`);
    }

    return fragment.create(Object.assign({}, properties, {
      expression: this
    }));
  }

  async load(properties) {
    var entity = this.createEntity(properties);
    await entity.load(properties);
    return entity;
  }
}

export class RootExpression extends BaseExpression {
  constructor(public childNodes:Array<BaseExpression>) {
    super('root');
  }
}

export class ElementExpression extends BaseExpression {
  constructor(
    public nodeName:string,
    public attributes:Array<BaseExpression>,
    public childNodes:Array<BaseExpression>) {
    super('element');
  }
}

export class StringExpression extends BaseExpression {
  constructor(public value:string) {
    super('root');
  }
}

export class AttributeExpression extends BaseExpression {
  constructor(public key:string, public value:BaseExpression) {
    super('attribute');
  }
}

export class TextExpression extends BaseExpression {
  constructor(public nodeValue:string) {
    super('text');
  }
}

export class CommentExpression extends BaseExpression {
  constructor(public nodeValue:string) {
    super('comment');
  }
}

export class ReferenceExpression extends BaseExpression {
  constructor(public path:Array<string>) {
    super('reference');
  }
}

export class ScriptExpression extends BaseExpression {
  constructor(public value:BaseExpression) {
    super('script');
  }
}

export class BlockExpression extends BaseExpression {
  constructor(public script:BaseExpression) {
    super('block');
  }
}

export class FunctionCallExpression extends BaseExpression {
  constructor(public reference:ReferenceExpression, public parameters:Array<BaseExpression>) {
    super('function-call');
  }
}

export class OperationExpression extends BaseExpression {
  constructor(public operator:string, public left:BaseExpression, public right:BaseExpression) {
    super('operation');
  }
}

export class LiteralExpression extends BaseExpression {
  constructor(public value:any) {
    super('literal');
  }
}

export class NegativeExpression extends BaseExpression {
  constructor(public value:BaseExpression) {
    super('negative');
  }
}

export class NotExpression extends BaseExpression {
  constructor(public value:BaseExpression) {
    super('not');
  }
}

export class TernaryExpression extends BaseExpression {
  constructor(public condition:BaseExpression, public left:BaseExpression, public right:BaseExpression) {
    super('ternary');
  }
}

export class HashExpression extends BaseExpression {
  constructor(public values:any) {
    super('hash');
  }
}