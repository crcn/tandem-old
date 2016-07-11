import DisplayEntity from 'common/entities/display';
import { FactoryFragment } from 'common/fragments';

export default class DOMFrameEntitiy extends DisplayEntity {
  constructor(properties) {
    super({
      displayType: 'htmlFrame',
      nodeType: 1,
      ...properties
    });
  }
}

export const fragment = FactoryFragment.create('entities/element/frame', DOMFrameEntitiy);
