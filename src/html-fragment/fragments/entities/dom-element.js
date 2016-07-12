import DisplayEntity from 'common/entities/display';
import { FactoryFragment } from 'common/fragments';

export default class DOMElementEntity extends DisplayEntity {
  constructor(properties) {
    super({
      displayType: 'htmlElement',
      nodeType: 1,
      ...properties,
    });
  }
}

export const fragment = FactoryFragment.create('entities/element', DOMElementEntity);
