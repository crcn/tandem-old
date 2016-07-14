import { FactoryFragment } from 'common/fragments';

import Entity from 'common/entities/entity';

class TextEntity extends Entity {
  async execute({ section }) {
    section.appendChild(this.node = document.createTextNode(this.expression.nodeValue));
  }
}

export const fragment = FactoryFragment.create({
  ns: 'entities/text',
  factory: TextEntity
})
