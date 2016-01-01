import { DisplayEntity } from 'editor/entities';

class TextEntity extends DisplayEntity {
  constructor(properties, children) {
    super({ type: 'component', componentType: 'text', ...properties }, children);
  }
}

export default TextEntity;
