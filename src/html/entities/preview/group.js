import { mergeBoundingRects } from 'common/utils/geom';
import { calculateBoundingRect } from './utils';
import CoreObject from 'common/object';

export default class GroupPreview extends CoreObject {
  constructor(entity) {
    super();
    this.entity = entity;
  }

  getBoundingRect() {
    var rect = mergeBoundingRects(this.entity.section.childNodes.map((node) => (
      node.nodeType === 1 ? calculateBoundingRect(node) : void 0
    )));

    return rect;
  }

  getCapabilities() {
    return {
      movable: false,
      resizable: false,
    };
  }
}
