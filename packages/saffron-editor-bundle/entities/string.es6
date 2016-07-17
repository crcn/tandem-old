import Entity from 'saffron-common/entities/entity';
import { FactoryFragment } from 'saffron-common/fragments';

export default class StringEntity extends Entity {
  async load() {
    this.value = this.expression.value;
  }
}

export const fragment = FactoryFragment.create({
  ns      : 'entities/string',
  factory : StringEntity,
});
