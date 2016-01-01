import { DisplayEntity } from 'common/entities';

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
