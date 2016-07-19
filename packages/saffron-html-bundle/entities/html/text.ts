import { FactoryFragment } from 'saffron-common/lib/fragments/index';

import Entity from 'saffron-common/lib/entities/entity';

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

export const fragment = new FactoryFragment({
  ns: 'entities/htmlText',
  factory: TextEntity
});
