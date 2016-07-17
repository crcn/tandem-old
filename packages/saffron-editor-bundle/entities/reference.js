import Entity from 'saffron-common/entities/entity';
import { FactoryFragment } from 'saffron-common/fragments';
import get from 'saffron-common/utils/object/get';

export default class ReferenceEntity extends Entity {
  async load(options) {
    this.value = get(options.context || {}, this.expression.path.join('.'));
  }
}

export const fragment = FactoryFragment.create({
  ns      : 'entities/reference',
  factory : ReferenceEntity,
});
