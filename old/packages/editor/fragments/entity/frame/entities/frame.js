import { DisplayEntity } from 'common/entities';

class FrameEntity extends DisplayEntity {

  constructor(properties, children) {
    super({
      type: 'component',
      componentType: 'frame',
      ...properties
    }, children);
  }
}

export default FrameEntity;
