import Entity from 'common/entities/entity';
import { FactoryFragment } from 'common/fragments';

export default class BlockEntity extends Entity {
  async execute(options) {

    options.section.appendChild(document.createTextNode('block'));
  }
}

export const fragment = FactoryFragment.create({
  ns: 'entities/block',
  factory: BlockEntity
});
