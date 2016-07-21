import Entity from 'saffron-front-end/src/entities/base';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import { HTMLAttributeExpression } from '../../parsers/expressions';

export default class AttributeEntity extends Entity<HTMLAttributeExpression> {

  public value:any;
  
  async load(options) {
    this.value = (await this.expression.value.load(options)).value;
  }
}

export const fragment = new ClassFactoryFragment('entities/htmlAttribute', AttributeEntity);
