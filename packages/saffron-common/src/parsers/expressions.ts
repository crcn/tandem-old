
/**
 * Generic
 */
 
export class BaseExpression {
  constructor(public ns:string) { }

  createEntity(properties:any) {
    const fragment = properties.fragments.query<any>(`entities/${this.ns}`);

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

/**
 * HTML
 */

export class HTMLElementExpression extends BaseExpression {
  constructor(
    public nodeName:string,
    public attributes:Array<BaseExpression>,
    public childNodes:Array<BaseExpression>) {
    super('htmlElement');
  }
}

export class HTMLAttributeExpression extends BaseExpression {
  constructor(public key:string, public value:BaseExpression) {
    super('htmlAttribute');
  }
}

export class HTMLTextExpression extends BaseExpression {
  constructor(public nodeValue:string) {
    super('htmlText');
  }
}

export class HTMLCommentExpression extends BaseExpression {
  constructor(public nodeValue:string) {
    super('htmlComment');
  }
}

export class HTMLScriptExpression extends BaseExpression {
  constructor(public value:BaseExpression) {
    super('htmlScript');
  }
}

export class HTMLBlockExpression extends BaseExpression {
  constructor(public script:BaseExpression) {
    super('htmlBlock');
  }
}

/**
 * CSS
 */

export class CSSStyleExpression extends BaseExpression {
  constructor(public declarations:Array<BaseExpression>) {
    super('cssStyle');
  }
}

export class CSSStyleDeclaration extends BaseExpression {
  constructor(public key:string, public value:BaseExpression) {
    super('cssStyleDeclaration');
  }
}

export class CSSLiteralExpression extends BaseExpression {
  constructor(public value:string) {
    super('cssLiteral');
  }
}

export class CSSFunctionCallExpression extends BaseExpression {
  constructor(public name:string, public parameters:Array<BaseExpression>) {
    super('cssFunctionCall');
  }
}

export class CSSListValueExpression extends BaseExpression {
  constructor(public values:Array<BaseExpression>) {
    super('cssListValue');
  }
}

/**
 *  JavaScript
 */

export class StringExpression extends BaseExpression {
  constructor(public value:string) {
    super('string');
  }
}

export class ReferenceExpression extends BaseExpression {
  constructor(public path:Array<string>) {
    super('reference');
  }
}

export class FunctionCallExpression extends BaseExpression {
  constructor(public reference:ReferenceExpression, public parameters:Array<BaseExpression>) {
    super('functionCall');
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
