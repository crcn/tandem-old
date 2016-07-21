import {
  RootExpression,
  HTMLElementExpression,
  HTMLBlockExpression,
  HTMLScriptExpression,
  HTMLAttributeExpression,
  HTMLCommentExpression,
  HTMLExpression,
  HTMLTextExpression,
  CSSFunctionCallExpression,
  CSSLiteralExpression,
  CSSListValueExpression,
  CSSStyleDeclarationExpression,
  CSSStyleExpression,
  ReferenceExpression,
  StringExpression,
  HashExpression,
  NotExpression,
  TernaryExpression,
  LiteralExpression,
  FunctionCallExpression,
  NegativeExpression,
  OperationExpression,
} from '../expressions/index';


import {
  NodeSection,
  FragmentSection
} from 'saffron-front-end/src/section/index';

export interface IEntity {
  load():void;
  update():void;
  flatten():Array<IEntity>;
}

abstract class BaseEntity<T> implements IEntity {

  constructor(public expression:T) {

  }

  public load() {

  }

  public update() {
    
  }

  public flatten():Array<IEntity> {
    return [];
  }
}

/**
 * HTML section
 */


export interface IHTMLNodeEntity extends IEntity {
  section:FragmentSection|NodeSection;
}

export interface IValueEntity extends IEntity {
  value:any;
}
 
export abstract class HTMLNodeEntity<T> extends BaseEntity<T> implements IHTMLNodeEntity {
  public section:FragmentSection|NodeSection;
}

export abstract class ValueEntity<T, V> extends BaseEntity<T> implements IValueEntity {
  public value:V;
}

export class RootEntity extends HTMLNodeEntity<RootExpression> {

  constructor(expression:RootExpression) {
    super(expression);
    this.section = new FragmentSection();
  }

  async load():Promise<RootEntity> {
    for (const childExpression of this.expression.childNodes) {
      const childEntity = childExpression.createEntity();
      await childEntity.load();
      this.section.appendChild(childEntity.section.toFragment());
    }
    return this;
  }
}

export class ElementEntity extends HTMLNodeEntity<HTMLElementExpression> {

  public attributes:any;
  public childNodes:Array<IHTMLNodeEntity>;

  async load() {
    var node = document.createElement('div');
    this.section = new NodeSection(node);

    this.attributes = {};
    this.childNodes = [];

    for (const attributeExpression of this.expression.attributes) {
      const attributeEntity = attributeExpression.createEntity();
      await attributeEntity.load();
      this.attributes[attributeExpression.key] = attributeEntity;
      node.setAttribute(attributeExpression.key, attributeEntity.toString());
    }

    for (const childExpression of this.expression.childNodes) {
      const childEntity = childExpression.createEntity();
      await childEntity.load();
      this.section.appendChild(childEntity.section.toFragment());
    }
  }
}

export class TextEntity extends HTMLNodeEntity<HTMLTextExpression> {
  async load() {
    const node = document.createTextNode(this.expression.nodeValue);
    this.section = new NodeSection(node);
  }
}

export class CommentEntity extends HTMLNodeEntity<HTMLCommentExpression> {
  load() {
    const node = document.createComment(this.expression.nodeValue);
  }
}

export class ScriptEntity extends HTMLNodeEntity<HTMLScriptExpression> { }

export class BlockEntity extends HTMLNodeEntity<HTMLBlockExpression> {
  load() {
    this.section = new NodeSection(document.createTextNode(''));
  }
}
 
export class AttributeEntity extends BaseEntity<HTMLAttributeExpression> {

  public value:any;

  public get key() {
    return this.expression.key;
  }

  async load() {
    this.value = this.expression.value.createEntity();
    await this.value.load(); 
  }

  public toString() {
    return this.value.toString();
  }
}

/**
 * CSS section
 */

export class CSSLiteralEntity extends ValueEntity<CSSLiteralExpression, any> {
  constructor(expression:CSSLiteralExpression) {
    super(expression);
    this.value = expression.value;
  }
}

export class CSSStyleEntity extends ValueEntity<CSSStyleExpression, Object> {
  load() {
    this.value = {};
    for (const declarationExpression of this.expression.declarations) { 
      const entity = declarationExpression.createEntity();
      entity.load();
      this.value[entity.key] = entity.value;
    }
  }

  toString() { 
    const buffer = [];
    for (const key in this.value) {
      buffer.push(`${key}:${this.value[key]};`);
    }
    return buffer.join('');
  }
} 
export class CSSListValueEntity extends ValueEntity<CSSListValueExpression, any[]> { } 
export class CSSStyleDeclarationEntity extends ValueEntity<CSSStyleDeclarationExpression, string> {
  get key():string {
    return this.expression.key;
  }
  
  load() {
    this.value = this.expression.value.createEntity().value;
  }
}
export class CSSFunctionCallEntity extends BaseEntity<CSSFunctionCallExpression> {
  load() {
    this.value = 'red';
  }
}

/**
 * JS
 */

export class ReferenceEntity extends ValueEntity<ReferenceExpression, any> { }
export class StringEntity extends ValueEntity<StringExpression, string> { }
export class HashEntity extends ValueEntity<HashExpression, Object> { }
export class TernaryEntity extends ValueEntity<TernaryExpression, any> { }
export class NotEntity extends ValueEntity<NotExpression, boolean> { }
export class NegativeEntity extends ValueEntity<NegativeExpression, number> { }
export class FunctionCallEntity extends ValueEntity<FunctionCallExpression, any> { }
export class OperationEntity extends ValueEntity<OperationExpression, any> { }
export class LiteralEntity extends ValueEntity<LiteralExpression, any> { }