import Entity from 'saffron-front-end/src/entities/entity';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';

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

export const fragment = new ClassFactoryFragment('entities/htmlBlock', BlockEntity);
