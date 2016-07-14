import Entity from 'common/entities/entity';
import { FactoryFragment } from 'common/fragments';
import get from 'common/utils/object/get';

export default class ReferenceEntity extends Entity {
  async execute(options) {
    var context = options.context;
    this.value = get(options.context || {}, this.expression.path.join('.'));
  }
}

export const fragment = FactoryFragment.create({
  ns: 'entities/reference',
  factory: ReferenceEntity
});
