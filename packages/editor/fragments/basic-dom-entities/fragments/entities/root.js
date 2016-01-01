import { Entity } from 'editor/entities';

class RootEntity extends Entity {
  constructor(properties, children) {
    super({
      type: 'root',
      ...properties
    }, children);
  }

  getComputedStyle() {
    return {
      left: 0,
      top: 0,
      width: this.canvasWidth,
      height: this.canvasHeight
    }
  }
}

export default RootEntity;
