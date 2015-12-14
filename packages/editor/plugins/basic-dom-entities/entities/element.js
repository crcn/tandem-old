import { DisplayEntity } from 'editor/entities';

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
