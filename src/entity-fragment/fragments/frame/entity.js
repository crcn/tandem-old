import DisplayEntity from 'common/entities/display';
import { FactoryFragment } from 'common/fragments';

export default class FrameEntity extends DisplayEntity {
  constructor(properties) {
    super({
      ...properties,
      displayType: 'frame',
    });
  }
}

export const fragment = FactoryFragment.create('entities/frame', FrameEntity);
