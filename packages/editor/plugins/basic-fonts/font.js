import { Entity } from 'editor/entity-types';

class Font extends Entity {
  constructor(name) {
    super({ type: 'font', name: name });
  }
}

export default Font;
