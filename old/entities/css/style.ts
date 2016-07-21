import Entity from 'saffron-front-end/src/entities/base';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import { CSSStyleExpression } from '../../parsers/expressions';
import StyleDeclarationEntity from './declaration';
 
export default class StyleEntity extends Entity<CSSStyleExpression> {

  public declarations:Array<StyleDeclarationEntity>;

} 

export const fragment = new ClassFactoryFragment('entities/cssStyle', StyleEntity);