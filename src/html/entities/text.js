import { FactoryFragment } from 'common/fragments';

import Entity from 'common/entities/entity';

class TextEntity extends Entity {
  async load({ section }) {
    section.appendChild(this.node = document.createTextNode(this.expression.nodeValue));
  }

  update() {
    this.node.nodeValue = this.expression.nodeValue;
  }

  willUnmount() {
    this.node.parentNode.removeChild(this.node);
  }
}

export const fragment = FactoryFragment.create({
  ns: 'entities/text',
  factory: TextEntity
});
