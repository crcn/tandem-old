import { DisplayEntity } from 'common/entities';

class ElementEntity extends DisplayEntity {

  constructor(properties, children) {
    super({
      type: 'component',
      componentType: 'element',
      ...properties
    }, children);
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
    this.notifyChange();
  }
}

export default ElementEntity;
