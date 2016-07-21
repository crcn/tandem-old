import FragmentDictionary from 'saffron-common/src/fragments/collection';
import {
  IEntity,
  SymbolTable,
  HTMLRootEntity,
  StringEntity,
  HTMLTextEntity,
  HTMLNodeEntity,
  ReferenceEntity,
  IHTMLNodeEntity,
  HTMLBlockEntity,
  HTMLElementEntity,
  HTMLAttributeEntity,
  HTMLCommentEntity,
  HashEntity,
  TernaryEntity,
  NotEntity,
  NegativeEntity,
  LiteralEntity,
  OperationEntity,
  CSSListValueEntity,
  CSSLiteralEntity,
  CSSStyleEntity,
  HTMLScriptEntity,
  FunctionCallEntity,
  CSSStyleDeclarationEntity,
  CSSFunctionCallEntity,
  IValueEntity
} from '../entities/index';

/**
 * Generic
 */

export class BaseExpression<T extends IEntity> {
  constructor(private _entityClass:{new(expression:BaseExpression<T>, symbolTable:SymbolTable):T}) {

  }
  createEntity(symbolTable:SymbolTable):T {
    return new this._entityClass(this, symbolTable); 
  }
}

export class HTMLRootExpression extends BaseExpression<HTMLRootEntity> {
  constructor(public childNodes:Array<HTMLExpression<IHTMLNodeEntity>>) {
    super(HTMLRootEntity);
  }
}

export class HTMLExpression<T extends IHTMLNodeEntity> extends BaseExpression<T> { }

/**
 * HTML
 */

export class HTMLElementExpression extends HTMLExpression<HTMLElementEntity> {
  constructor(
    public nodeName:string,
    public attributes:Array<HTMLAttributeExpression>,
    public childNodes:Array<HTMLExpression<IHTMLNodeEntity>>) {
    super(HTMLElementEntity);
  }
}

export class HTMLAttributeExpression extends BaseExpression<HTMLAttributeEntity> {
  constructor(public key:string, public value:BaseExpression<IValueEntity>) {
    super(HTMLAttributeEntity);
  }
}

export class HTMLTextExpression extends HTMLExpression<HTMLTextEntity> {
  constructor(public nodeValue:string) {
    super(HTMLTextEntity);
  }
}

export class HTMLCommentExpression extends HTMLExpression<HTMLCommentEntity> {
  constructor(public nodeValue:string) {
    super(HTMLCommentEntity);
  }
}

export class HTMLScriptExpression extends HTMLExpression<HTMLScriptEntity> {
  constructor(public value:BaseExpression<IValueEntity>) {
    super(HTMLScriptEntity);
  }
}

export class HTMLBlockExpression extends HTMLExpression<HTMLBlockEntity> {
  constructor(public script:BaseExpression<IValueEntity>) {
    super(HTMLBlockEntity);
  }
}

/**
 * CSS
 */

export class CSSStyleExpression extends BaseExpression<CSSStyleEntity> {
  constructor(public declarations:Array<CSSStyleDeclarationExpression>) {
    super(CSSStyleEntity);
  }
}

export class CSSStyleDeclarationExpression extends BaseExpression<CSSStyleDeclarationEntity> {
  constructor(public key:string, public value:BaseExpression<IValueEntity>) {
    super(CSSStyleDeclarationEntity);
  }
}

export class CSSLiteralExpression extends BaseExpression<CSSLiteralEntity> {
  constructor(public value:string) {
    super(CSSLiteralEntity);
  }
}

export class CSSFunctionCallExpression extends BaseExpression<CSSFunctionCallEntity> {
  constructor(public name:string, public parameters:Array<BaseExpression<IValueEntity>>) {
    super(CSSFunctionCallEntity);
  }
}

export class CSSListValueExpression extends BaseExpression<CSSListValueEntity> {
  constructor(public values:Array<BaseExpression<IValueEntity>>) {
    super(CSSListValueEntity);
  }
}

/**
 *  JavaScript
 */

export class StringExpression extends BaseExpression<StringEntity> {
  constructor(public value:string) {
    super(StringEntity);
  }
}

export class ReferenceExpression extends BaseExpression<ReferenceEntity> {
  constructor(public path:Array<string>) {
    super(ReferenceEntity);
  }
}

export class FunctionCallExpression extends BaseExpression<FunctionCallEntity> {
  constructor(public reference:ReferenceExpression, public parameters:Array<BaseExpression<any>>) {
    super(FunctionCallEntity);
  }
}

export class OperationExpression extends BaseExpression<OperationEntity> {
  constructor(public operator:string, public left:BaseExpression<IEntity>, public right:BaseExpression<IEntity>) {
    super(OperationEntity);
  }
}

export class LiteralExpression extends BaseExpression<LiteralEntity> {
  constructor(public value:any) {
    super(LiteralEntity);
  }
}

export class NegativeExpression extends BaseExpression<NegativeEntity> {
  constructor(public value:BaseExpression<IEntity>) {
    super(NegativeEntity);
  }
}

export class NotExpression extends BaseExpression<NotEntity> {
  constructor(public value:BaseExpression<IEntity>) {
    super(NotEntity);
  }
}

export class TernaryExpression extends BaseExpression<TernaryEntity> {
  constructor(public condition:BaseExpression<IEntity>, public left:BaseExpression<IEntity>, public right:BaseExpression<IEntity>) {
    super(TernaryEntity);
  }
}

export class HashExpression extends BaseExpression<HashEntity> {
  constructor(public values:any) {
    super(HashEntity);
  }
}
