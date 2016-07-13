import DisplayEntity from 'common/entities/display';
import { FactoryFragment } from 'common/fragments';

export default class DOMTextEntity extends DisplayEntity {
  constructor(properties) {
    super({
      displayType: 'htmlText',
      nodeType: 3,
      ...properties,
    });
  }
}

export const fragment = FactoryFragment.create({ ns: 'entities/text', factory: DOMTextEntity });
