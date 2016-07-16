import Entity from 'common/entities/entity';
import { FactoryFragment } from 'common/fragments';

export default class AttributeEntity extends Entity {
  async load(options) {
    this.value = (await this.expression.value.load(options)).value;
  }
}

export const fragment = FactoryFragment.create({
  ns: 'entities/attribute',
  factory: AttributeEntity
});
