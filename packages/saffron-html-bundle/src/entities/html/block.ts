import Entity from 'saffron-common/lib/entities/entity';
import { FactoryFragment } from 'saffron-common/lib/fragments/index';

export default class BlockEntity extends Entity {

  private _node:any;

  async load(options) {
    options.section.appendChild(this._node = document.createTextNode(''));
    await this.update(options);
  }

  async update(options) {
    this._node.nodeValue = (await this.expression.script.load(options)).value;
  }
}

export const fragment = new FactoryFragment({
  ns: 'entities/htmlBlock',
  factory: BlockEntity
});
