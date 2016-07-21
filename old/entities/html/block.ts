import Entity from 'saffron-front-end/src/entities/base';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import { HTMLBlockExpression } from '../../parsers/expressions';

export default class BlockEntity extends Entity<HTMLBlockExpression> {

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
