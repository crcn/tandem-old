import Entity from 'saffron-common/lib/entities/entity';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';

export default class StringEntity extends Entity {
  public value:any;
  public expression:any;
  
  async load() {
    this.value = this.expression.value;
  }
}

export const fragment = new ClassFactoryFragment('entities/string', StringEntity);