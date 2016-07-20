import Entity from 'saffron-common/lib/entities/entity';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';

export default class AttributeEntity extends Entity {

  public value:any;
  
  async load(options) {
    this.value = (await this.expression.value.load(options)).value;
  }
}

export const fragment = new ClassFactoryFragment('entities/htmlAttribute', AttributeEntity);
