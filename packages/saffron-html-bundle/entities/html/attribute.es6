import Entity from 'saffron-common/entities/entity';
import { FactoryFragment } from 'saffron-common/fragments';

export default class AttributeEntity extends Entity {
  async load(options) {
    this.value = (await this.expression.value.load(options)).value;
  }
}

export const fragment = FactoryFragment.create({
  ns: 'entities/htmlAttribute',
  factory: AttributeEntity
});
