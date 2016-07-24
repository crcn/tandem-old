import { HTMLRootEntity, SymbolTable, HTMLNodeEntity } from './entities/index';
import { HTMLExpression } from './expressions/index';
import { FragmentSection } from 'sf-front-end/section/index';

import * as XMLParser from './parsers/xml.peg';

export default class HTMLRuntime {

  private _rootEntity:HTMLNodeEntity<any>;
  private _source:string;

  private _symbolTable:SymbolTable = new SymbolTable({
    currentSection: new FragmentSection()
  });

  public get source():string {
    return this._source;
  }

  public get entity():HTMLNodeEntity<any> {
    return this._rootEntity;
  }

  public get symbolTable():SymbolTable {
    return this._symbolTable;
  }

  public async load(source:string):Promise<HTMLRuntime> {
    this._source = source;
    const newExpression:HTMLExpression<HTMLNodeEntity<any>> = XMLParser.parse(source);

    if (this._rootEntity && this._rootEntity.expression.constructor === newExpression.constructor) {
      this._rootEntity.expression = newExpression;
    } else {
      this._rootEntity = newExpression.createEntity(this.symbolTable.createChild());
    }

    await this._rootEntity.update();

    return this;
  }
}