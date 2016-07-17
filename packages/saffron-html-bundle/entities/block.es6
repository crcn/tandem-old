import Entity from 'saffron-common/entities/entity';
import { FactoryFragment } from 'saffron-common/fragments';

export default class BlockEntity extends Entity {
  async load(options) {
    options.section.appendChild(this.node = document.createTextNode(''));
    await this.update(options);
  }

  async update(options) {
    this.node.nodeValue = (await this.expression.script.load(options)).value;
  }
}

export const fragment = FactoryFragment.create({
  ns: 'entities/block',
  factory: BlockEntity
});
