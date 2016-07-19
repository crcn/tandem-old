import Entity from 'saffron-common/lib/entities/entity';
import { FactoryFragment } from 'saffron-common/lib/fragments/index';
import get from 'saffron-common/lib/utils/object/get';

export default class ReferenceEntity extends Entity {
  public  value:any;
  public expression:any;
  async load(options) {
    this.value = get(options.context || {}, this.expression.path.join('.'));
  }
}

export const fragment = new FactoryFragment({
  ns      : 'entities/reference',
  factory : ReferenceEntity,
});
