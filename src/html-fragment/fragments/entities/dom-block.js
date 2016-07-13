import DisplayEntity from 'common/entities/display';
import { FactoryFragment } from 'common/fragments';

export default class DOMBlockEntity extends DisplayEntity {
  constructor(properties) {
    super({
      displayType: 'htmlBlock',
      nodeType: 3,
      ...properties,
    });
  }
}

export const fragment = FactoryFragment.create({ ns: 'entities/block', factory: DOMBlockEntity });
