import { DisplayEntity } from 'editor/entity-types';

class ElementEntitiy extends DisplayEntity {
  constructor(properties, children) {
    super({
      type: 'component',
      componentType: 'element',
      ...properties
    }, children);
  }
}

export default ElementEntitiy;
