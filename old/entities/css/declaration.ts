import Entity from 'saffron-front-end/src/entities/base';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import { CSSStyleDeclaration } from '../../parsers/expressions';
 
export default class StyleDeclarationEntity extends Entity<CSSStyleDeclaration> {

  // public declarations:Array<Entity>;

  load() {
    console.log(this.expression.value);
  }
} 

export const fragment = new ClassFactoryFragment('entities/cssStyleDeclaration', StyleDeclarationEntity);