import { DisplayEntity } from 'saffron-common/entities';

class TextEntity extends DisplayEntity {
  constructor(properties, children) {
    super({ type: 'component', componentType: 'text', ...properties }, children);
  }
}

export default TextEntity;
