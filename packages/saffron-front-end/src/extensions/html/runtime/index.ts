import { HTMLRootEntity, SymbolTable } from './entities/index';
import { HTMLRootExpression } from './expressions/index';
import { FragmentSection } from 'saffron-front-end/src/section/index';

import * as XMLParser from './parsers/xml.peg';

export default class HTMLRuntime {

  private _rootEntity:HTMLRootEntity;
  private _symbolTable:SymbolTable = new SymbolTable({
    currentSection: new FragmentSection()
  });

  public get entity():HTMLRootEntity {
    return this._rootEntity;
  }

  public get symbolTable():SymbolTable {
    return this._symbolTable;
  }

  public async load(source:string):Promise<HTMLRuntime> {
    const newRootExpression:HTMLRootExpression = XMLParser.parse(source);

    if (this._rootEntity) {
      // TODO - diff here
      this._rootEntity.expression = newRootExpression;
    } else {
      this._rootEntity = newRootExpression.createEntity(this.symbolTable.createChild());
    }
    
    await this._rootEntity.load();

    return this;
  }
} 