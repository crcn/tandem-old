import { DisplayEntity } from 'editor/entities';

class ElementEntity extends DisplayEntity {
  constructor(properties, children) {
    super({
      type: 'component',
      componentType: 'element',
      ...properties
    }, children);
  }
}

export default ElementEntity;
