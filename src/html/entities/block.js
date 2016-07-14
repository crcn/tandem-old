import Entity from 'common/entities/entity';
import { FactoryFragment } from 'common/fragments';

export default class BlockEntity extends Entity {
  async execute(options) {
    var value = (await this.expression.script.execute(options)).value;
    var node = document.createTextNode(value);
    options.section.appendChild(node);
  }
}

export const fragment = FactoryFragment.create({
  ns: 'entities/block',
  factory: BlockEntity,
});
