import FragmentDictionary from 'sf-common/fragments/collection';

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

export class ICursorPosition {
  start:number;
  end:number;
}


/**
 * Generic
 */

export class BaseExpression<T extends IEntity> {
  constructor(private _entityClass:{new(expression:BaseExpression<T>, symbolTable:SymbolTable):T}, public position:ICursorPosition) {

  }

  createEntity(symbolTable:SymbolTable):T {
    return new this._entityClass(this, symbolTable);
  }

  public flatten():Array<BaseExpression<any>> {
    const items = [];
    this._flattenDeep(items);
    return items;
  }

  public _flattenDeep(items:Array<BaseExpression<any>>) {
    items.push(this);
  }

  public toString() {
    return '';
  }
}

function _flattenEach(fromItems:Array<BaseExpression<any>>, toItems:Array<BaseExpression<any>>) {
  for (const item of fromItems) {
    item._flattenDeep(toItems);
  }
}

function _addEachTokens(fromItems:Array<BaseExpression<any>>, tokens:string[]) {
  for (const item of fromItems) {
    // item._addTokens(tokens);
  }
}

export class HTMLRootExpression extends BaseExpression<HTMLRootEntity> {
  constructor(public childNodes:Array<HTMLExpression<IHTMLNodeEntity>>, position:ICursorPosition) {
    super(HTMLRootEntity, position);
  }

  public _flattenDeep(items) {
    super._flattenDeep(items);
    _flattenEach(this.childNodes, items);
  }

  public toString() {
    return this.childNodes.join('');
  }
}

export abstract class HTMLExpression<T extends IHTMLNodeEntity> extends BaseExpression<T> {
}

/**
 * HTML
 */

export class HTMLElementExpression extends HTMLExpression<HTMLElementEntity> {
  constructor(
    public nodeName:string,
    public attributes:Array<HTMLAttributeExpression>,
    public childNodes:Array<HTMLExpression<IHTMLNodeEntity>>,
    public position:ICursorPosition) {
    super(HTMLElementEntity, position);
  }

  /*
  TODO:

  public createEntity(options:LoadOptions)
  */
  public _flattenDeep(items) {
    super._flattenDeep(items);
    _flattenEach(this.attributes, items);
    _flattenEach(this.childNodes, items);
  }

  public toString() {
    var buffer = ['<', this.nodeName];
    for (var attribute of this.attributes) {
      buffer.push(' ', attribute.toString());
    }
    if (this.childNodes.length) {
      buffer.push('>');
      for (var child of this.childNodes) {
        buffer.push(child.toString());
      }
      buffer.push('</', this.nodeName, '>');
    } else {
      buffer.push('/>');
    }
    return buffer.join('');
  }
}

export class HTMLAttributeExpression extends BaseExpression<HTMLAttributeEntity> {
  constructor(public key:string, public value:BaseExpression<IValueEntity>, position:ICursorPosition) {
    super(HTMLAttributeEntity, position);
  }
  _flattenDeep(items) {
    super._flattenDeep(items);
    this.value._flattenDeep(items);
  }
  toString() {
    var buffer = [this.key];
    var value = this.value.toString();
    if (value !== '""') {
      buffer.push('=', value);
    }
    return buffer.join('');
  }
}

export class HTMLTextExpression extends HTMLExpression<HTMLTextEntity> {
  constructor(public nodeValue:string, public position:ICursorPosition) {
    super(HTMLTextEntity, position);
  }
  toString() {

    // only WS - trim
    if (/^[\s\n\t\r]+$/.test(this.nodeValue)) return '';
    return this.nodeValue.trim();
  }
}

export class HTMLCommentExpression extends HTMLExpression<HTMLCommentEntity> {
  constructor(public nodeValue:string, public position:ICursorPosition) {
    super(HTMLCommentEntity, position);
  }

  toString() {
    return ['<!--', this.nodeValue, '-->'].join('');
  }
}

export class HTMLScriptExpression extends HTMLExpression<HTMLScriptEntity> {
  constructor(public value:BaseExpression<IValueEntity>, public position:ICursorPosition) {
    super(HTMLScriptEntity, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.value._flattenDeep(items);
  }
}

export class HTMLBlockExpression extends HTMLExpression<HTMLBlockEntity> {
  constructor(public script:BaseExpression<IValueEntity>, public position:ICursorPosition) {
    super(HTMLBlockEntity, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.script._flattenDeep(items);
  }
}

/**
 * CSS
 */

export class CSSStyleExpression extends BaseExpression<CSSStyleEntity> {
  constructor(public declarations:Array<CSSStyleDeclarationExpression>, public position:ICursorPosition) {
    super(CSSStyleEntity, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    _flattenEach(this.declarations, items);
  }
  toString() {
    return this.declarations.join('');
  };
}

export class CSSStyleDeclarationExpression extends BaseExpression<CSSStyleDeclarationEntity> {
  constructor(public key:string, public value:BaseExpression<IValueEntity>, public position:ICursorPosition) {
    super(CSSStyleDeclarationEntity, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.value._flattenDeep(items);
  }
  toString() {

    return [this.key, ':', this.value.toString(), ';'].join(' ');
  }
}


export class CSSLiteralExpression extends BaseExpression<CSSLiteralEntity> {
  constructor(public value:string, public position:ICursorPosition) {
    super(CSSLiteralEntity, position);
  }
  toString() {
    return this.value;
  }
}

export class CSSFunctionCallExpression extends BaseExpression<CSSFunctionCallEntity> {
  constructor(public name:string, public parameters:Array<BaseExpression<IValueEntity>>, public position:ICursorPosition) {
    super(CSSFunctionCallEntity, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    _flattenEach(this.parameters, items);
  }
  toString() {
    return [this.name, '(', this.parameters.join(','), ')'].join('');
  }
}

export class CSSListValueExpression extends BaseExpression<CSSListValueEntity> {
  constructor(public values:Array<BaseExpression<IValueEntity>>, public position:ICursorPosition) {
    super(CSSListValueEntity, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    _flattenEach(this.values, items);
  }
  toString() {
    return this.values.join(' ');
  }
}

/**
 *  JavaScript
 */

export class StringExpression extends BaseExpression<StringEntity> {
  constructor(public value:string, public position:ICursorPosition) {
    super(StringEntity, position);
  }
  toString() {
    return ['"', this.value, '"'].join('');
  }
}

export class ReferenceExpression extends BaseExpression<ReferenceEntity> {
  constructor(public path:Array<string>, public position:ICursorPosition) {
    super(ReferenceEntity, position);
  }
}

export class FunctionCallExpression extends BaseExpression<FunctionCallEntity> {
  constructor(public reference:ReferenceExpression, public parameters:Array<BaseExpression<any>>, public position:ICursorPosition) {
    super(FunctionCallEntity, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.reference._flattenDeep(items);
  }
}

export class OperationExpression extends BaseExpression<OperationEntity> {
  constructor(public operator:string, public left:BaseExpression<IEntity>, public right:BaseExpression<IEntity>, public position:ICursorPosition) {
    super(OperationEntity, position);
  }
}

export class LiteralExpression extends BaseExpression<LiteralEntity> {
  constructor(public value:any, public position:ICursorPosition) {
    super(LiteralEntity, position);
  }
}

export class NegativeExpression extends BaseExpression<NegativeEntity> {
  constructor(public value:BaseExpression<IEntity>, public position:ICursorPosition) {
    super(NegativeEntity, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.value._flattenDeep(items);
  }
}

export class NotExpression extends BaseExpression<NotEntity> {
  constructor(public value:BaseExpression<IEntity>, position:ICursorPosition) {
    super(NotEntity, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.value._flattenDeep(items);
  }
}

export class TernaryExpression extends BaseExpression<TernaryEntity> {
  constructor(public condition:BaseExpression<IEntity>, public left:BaseExpression<IEntity>, public right:BaseExpression<IEntity>, public position:ICursorPosition) {
    super(TernaryEntity, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.condition._flattenDeep(items);
  }
}

export class HashExpression extends BaseExpression<HashEntity> {
  constructor(public values:any, public position:ICursorPosition) {
    super(HashEntity, position);
  }
}
