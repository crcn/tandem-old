import { DisplayEntity } from 'editor/entity-types';

class TextEntity extends DisplayEntity {
  constructor(properties) {
    super({ type: 'component', componentType: 'text', ...properties });
  }
}

export default TextEntity;
