import {
  HTMLRootExpression,
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
  BaseExpression,
  LiteralExpression,
  FunctionCallExpression,
  NegativeExpression,
  OperationExpression,
} from '../expressions/index';

import HTMLElementPreview from './preview';


import {
  NodeSection,
  FragmentSection
} from 'sf-front-end/section/index';

export class SymbolTable {
  constructor(public _data:any = {}, private _parent:SymbolTable = undefined) { }

  public getValue<T>(key:string):T {
    return <T>(this._data[key] || (this._parent ? this._parent.getValue(key) : undefined));
  }

  public setValue(key:string, value:any):any {
    this._data[key] = value;
    return value;
  }

  public createChild(data:any = undefined):SymbolTable {
    return new SymbolTable(data, this);
  }
}

interface IHTMLElementAttributeController {

}

interface IHTMLElementEntityController {
  getAttribute(key:string):any;
  setAttribute(key:string, value:any):void;
  update();
  dispose();
}

abstract class BaseHTMLElementEntityController implements IHTMLElementEntityController {
  private _attributes:any = {};

  constructor(readonly entity:HTMLElementEntity) {

  }

  public getAttribute(key:string):any {
    return this._attributes[key];
  }

  public setAttribute(key:string, value:any):void {
    this._attributes[key] = value;
  }

  public update() {

  }

  public dispose() {

  }
}

export interface IEntity {
  update():any;
  flatten():Array<IEntity>;
  dispose();
}

abstract class BaseEntity<T> implements IEntity {

  constructor(public expression:T, readonly symbolTable:SymbolTable) {

  }

  public update() {

  }

  public dispose() {

  }

  public patch(expression:T) {
    this.expression = expression;
  }

  public flatten():Array<IEntity> {
    return [this];
  }
}

/**
 * HTML section
 */

// TODO - this needs to extends INode
export interface IHTMLNodeEntity extends IEntity {
  childNodes:Array<IHTMLNodeEntity>;
  parentNode:IHTMLNodeEntity;
  nextSibling:IHTMLNodeEntity;
  prevSibling:IHTMLNodeEntity;
  appendChild(node:IHTMLNodeEntity);
  removeChild(node:IHTMLNodeEntity);
}

export interface IValueEntity extends IEntity {
  value:any;
}

const CURRENT_SECTION_SYMBOL_KEY = 'currentSection';
export abstract class HTMLNodeEntity<T> extends BaseEntity<T> implements IHTMLNodeEntity {
  public parentNode:IHTMLNodeEntity;
  public type:string = 'display';
  private _childNodes:Array<IHTMLNodeEntity>;
  public get nextSibling():IHTMLNodeEntity {
    return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1];
  }
  public get prevSibling():IHTMLNodeEntity {
    return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) - 1];
  }

  public get childNodes():Array<IHTMLNodeEntity> {
    return this._childNodes || (this._childNodes = []);
  }
  public get currentSection():FragmentSection|NodeSection {
    return this.symbolTable.getValue<FragmentSection|NodeSection>(CURRENT_SECTION_SYMBOL_KEY);
  }

  public removeChild(child:IHTMLNodeEntity) {
    var i = this.childNodes.indexOf(child);
    if (~i) {
      this.childNodes.splice(i, 1);
      this._unlinkChild(child);
    }
  }

  public appendChild(child:IHTMLNodeEntity) {
    this.childNodes.push(child);
    this._linkChild(child);
  }

  private _linkChild(child:IHTMLNodeEntity) {
    if (child.parentNode) {
      child.parentNode.removeChild(this);
    }
    child.parentNode = this;
  }

  private _unlinkChild(child:IHTMLNodeEntity) {
    child.parentNode = undefined;
  }

  public dispose() {
    super.dispose();
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }

  public flatten():Array<IEntity> {
    const items = [];
    this._flattenDeep(items);
    return items;
  }

  protected _flattenDeep(items = []) {
    items.push(this);
    for (var child of this.childNodes) {
      (child as HTMLNodeEntity<any>)._flattenDeep(items);
    }
  }
}

export abstract class ValueEntity<T, V> extends BaseEntity<T> implements IValueEntity {
  public value:V;
}

export class HTMLRootEntity extends HTMLNodeEntity<HTMLRootExpression> {
  private _section:FragmentSection;

  constructor(expression:HTMLRootExpression, symbolTable:SymbolTable) {
    super(expression, symbolTable);
    this.currentSection.appendChild((this._section = new FragmentSection()).toFragment());
  }

  async update() {
    await updateChildNodes(this, this.expression.childNodes, this.symbolTable.createChild({
      [CURRENT_SECTION_SYMBOL_KEY]: this._section
    }));
  }
}

async function updateChildNodes(
  container:IHTMLNodeEntity,
  expressionChildNodes:Array<BaseExpression<IHTMLNodeEntity>>,
  symbolTable:SymbolTable
) {

  // first add new or existing child entities
  for (var i = 0, n = expressionChildNodes.length; i < n; i++) {
    const childExpression = expressionChildNodes[i];
    let childEntity;

    // update existing nodes first
    if (i < container.childNodes.length) {
      childEntity = container.childNodes[i];

      // same expression constructor?
      if (childEntity.expression.constructor == childExpression.constructor) {

        // replace the child expression so that it can continue diffing & patching
        childEntity.expression = childExpression;
        await childEntity.update();
      } else {
        var childNode = container.childNodes[i];
        childNode.dispose();
        i--;
        continue;
      }
    } else {
      childEntity = childExpression.createEntity(symbolTable);
      container.appendChild(childEntity);
      await childEntity.update();
    }
  }

  // remove child nodes now
  container.childNodes.slice(i).forEach(function(child) {
    child.dispose();
  });
}

function unloadChildren(entity:IHTMLNodeEntity) {
  for (const child of entity.childNodes) {
    child.dispose();
  }
}

class HTMLElementEntityController extends BaseHTMLElementEntityController {
  private _section:NodeSection;

  constructor(entity:HTMLElementEntity) {
    super(entity);
    this._section = new NodeSection(document.createElement(this.entity.expression.nodeName));
    entity.preview = new HTMLElementPreview(entity, this._section.targetNode);
    entity.currentSection.appendChild(this._section.toFragment());
  }

  getAttribute(key) {
    return this._section.targetNode.getAttribute(key);
  }

  setAttribute(key, value) {
    super.setAttribute(key, value);
    this._section.targetNode.setAttribute(key, value);
  }

  async update() {
    await updateChildNodes(this.entity, this.entity.expression.childNodes, this.entity.symbolTable.createChild({
      [CURRENT_SECTION_SYMBOL_KEY]: this._section
    }));
  }

  dispose() {
    super.dispose();
    this._section.remove();
    unloadChildren(this.entity);
  }
}

// TODO - possibly ditch entity controllers and define individual
// entities that need to behave a particular way instead. Entity controllers
// seems like an unnecessary abstraction
export class HTMLElementEntity extends HTMLNodeEntity<HTMLElementExpression> {

  readonly attributes:any = {};
  public ref:IHTMLElementEntityController;
  public nodeName:string;
  public preview:NodePreview;

  getAttribute(key) {
    return this.ref.getAttribute(key);
  }

  setAttribute(key, value) {
    this.ref.setAttribute(key, value);
  }

  async update() {

    if (this.ref && this.nodeName !== this.expression.nodeName) {
      this.ref.dispose();
      this.ref = undefined;
    }

    this.nodeName = this.expression.nodeName;

    if (!this.ref) {
      this.ref = new HTMLElementEntityController(this);
    }

    for (const attributeExpression of this.expression.attributes) {
      const attributeEntity = attributeExpression.createEntity(this.symbolTable);
      await attributeEntity.update();

      // TODO - check for attribute entity controllers
      this.attributes[attributeExpression.key] = attributeEntity;
      var value = attributeEntity.value;
      this.ref.setAttribute(attributeExpression.key, attributeEntity.value);
    }

    await this.ref.update();
  }

  dispose() {
    super.dispose();
    if (this.ref) {
      this.ref.dispose();
    }
  }
}

export class HTMLTextEntity extends HTMLNodeEntity<HTMLTextExpression> {

  public value:string;
  private _node:Text;

  constructor(expression:HTMLTextExpression, symbolTable:SymbolTable) {
    super(expression, symbolTable);
    this.currentSection.appendChild(this._node = document.createTextNode(this.value = this.expression.nodeValue));

  }

  async update() {
    if (this.expression.nodeValue !== this.value) {
      this._node.nodeValue = this.value = this.expression.nodeValue;
    }
  }

  dispose() {
    super.dispose();
    this._node.parentNode.removeChild(this._node);
  }
}

export class HTMLCommentEntity extends HTMLNodeEntity<HTMLCommentExpression> {

  private _node:Comment;

  constructor(expression:HTMLCommentExpression, symbolTable:SymbolTable) {
    super(expression, symbolTable);
    this.currentSection.appendChild(this._node = document.createComment(expression.nodeValue));
  }
  dispose() {
    super.dispose();
    this._node.parentNode.removeChild(this._node);
  }
}

export class HTMLScriptEntity extends HTMLNodeEntity<HTMLScriptExpression> { }

export class HTMLBlockEntity extends HTMLNodeEntity<HTMLBlockExpression> {
  constructor(expression:HTMLBlockExpression, symbolTable:SymbolTable) {
    super(expression, symbolTable);
    this.currentSection.appendChild(document.createTextNode(''));
  }
}

export class HTMLAttributeEntity extends BaseEntity<HTMLAttributeExpression> {

  private _value:IValueEntity;

  public get key() {
    return this.expression.key;
  }

  public get value() {
    return this._value.value;
  }

  async update() {
    this._value = this.expression.value.createEntity(this.symbolTable);
    await this._value.update();
  }
}

/**
 * CSS section
 */

export class CSSLiteralEntity extends ValueEntity<CSSLiteralExpression, any> {
  constructor(expression:CSSLiteralExpression, symbolTable:SymbolTable) {
    super(expression, symbolTable);
    this.value = expression.value;
  }
}

export class CSSStyleEntity extends ValueEntity<CSSStyleExpression, Object> {
  update() {

    var style = {};

    for (const declarationExpression of this.expression.declarations) {
      const entity = declarationExpression.createEntity(this.symbolTable);
      entity.update();
      style[entity.key] = entity.value;
    }

    this.value = style;
  }
}

export class CSSListValueEntity extends ValueEntity<CSSListValueExpression, any[]> { }
export class CSSStyleDeclarationEntity extends ValueEntity<CSSStyleDeclarationExpression, string> {
  get key():string {
    return this.expression.key;
  }

  update() {
    this.value = this.expression.value.createEntity(this.symbolTable).value;
  }
}

export class CSSFunctionCallEntity extends ValueEntity<CSSFunctionCallExpression, any> {
  update() {
    this.value = 'red';
  }
}

/**
 * JS
 */

export class ReferenceEntity extends ValueEntity<ReferenceExpression, any> { }
export class StringEntity extends ValueEntity<StringExpression, string> {
  constructor(expression:StringExpression, symbolTable:SymbolTable) {
    super(expression, symbolTable);
    this.value = expression.value;
  }
}
export class HashEntity extends ValueEntity<HashExpression, Object> { }
export class TernaryEntity extends ValueEntity<TernaryExpression, any> { }
export class NotEntity extends ValueEntity<NotExpression, boolean> { }
export class NegativeEntity extends ValueEntity<NegativeExpression, number> { }
export class FunctionCallEntity extends ValueEntity<FunctionCallExpression, any> { }
export class OperationEntity extends ValueEntity<OperationExpression, any> { }
export class LiteralEntity extends ValueEntity<LiteralExpression, any> {
  constructor(expression:LiteralExpression, symbolTable:SymbolTable) {
    super(expression, symbolTable);
    this.value = expression.value;
  }
}