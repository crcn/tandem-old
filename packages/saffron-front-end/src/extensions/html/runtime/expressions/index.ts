import FragmentDictionary from 'saffron-common/src/fragments/collection';
import {
  IEntity,
  RootEntity,
  HTMLNodeEntity,
  ElementEntity,
  TextEntity,
  ReferenceEntity,
  IHTMLNodeEntity,
  StringEntity,
  BlockEntity,
  AttributeEntity,
  CommentEntity,
  HashEntity,
  TernaryEntity,
  NotEntity,
  NegativeEntity,
  LiteralEntity,
  OperationEntity,
  CSSListValueEntity,
  CSSLiteralEntity,
  CSSStyleEntity,
  ScriptEntity,
  FunctionCallEntity,
  CSSStyleDeclarationEntity,
  CSSFunctionCallEntity,
  IValueEntity
} from '../entities/index';

/**
 * Generic
 */

export class BaseExpression<T extends IEntity> {
  constructor(private _entityClass:{new(expression:BaseExpression<T>):T}) {

  }
  createEntity():T {
    return new this._entityClass(this); 
  }
}

export class RootExpression extends BaseExpression<RootEntity> {
  constructor(public childNodes:Array<HTMLExpression<IHTMLNodeEntity>>) {
    super(RootEntity);
  }
}

export class HTMLExpression<T extends IHTMLNodeEntity> extends BaseExpression<T> {
 
}

/**
 * HTML
 */

export class HTMLElementExpression extends HTMLExpression<ElementEntity> {
  constructor(
    public nodeName:string,
    public attributes:Array<HTMLAttributeExpression>,
    public childNodes:Array<HTMLExpression<IHTMLNodeEntity>>) {
    super(ElementEntity);
  }
}

export class HTMLAttributeExpression extends BaseExpression<AttributeEntity> {
  constructor(public key:string, public value:BaseExpression<IValueEntity>) {
    super(AttributeEntity);
  }
}

export class HTMLTextExpression extends HTMLExpression<TextEntity> {
  constructor(public nodeValue:string) {
    super(TextEntity);
  }
}

export class HTMLCommentExpression extends HTMLExpression<CommentEntity> {
  constructor(public nodeValue:string) {
    super(CommentEntity);
  }
}

export class HTMLScriptExpression extends HTMLExpression<ScriptEntity> {
  constructor(public value:BaseExpression<IValueEntity>) {
    super(ScriptEntity);
  }
}

export class HTMLBlockExpression extends HTMLExpression<BlockEntity> {
  constructor(public script:BaseExpression<IValueEntity>) {
    super(BlockEntity);
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
