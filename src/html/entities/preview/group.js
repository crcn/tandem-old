import BoundingRect from 'common/geom/bounding-rect';
import { mergeBoundingRects } from 'common/utils/geom';
import { calculateBoundingRect, getCapabilities, setBoundingRect } from './utils';
import CoreObject from 'common/object';

export default class GroupPreview extends CoreObject {
  constructor(entity) {
    super();
    this.entity = entity;
  }

  getBoundingRect(zoom) {
    var rect = mergeBoundingRects(this.entity.section.childNodes.map(function(node) {
      return node.nodeType === 1 ? calculateBoundingRect(node) : void 0;
    }));

    return rect;
  }

  getCapabilities() {
    return {
      movable: false,
      resizable: false
    }
  }
}
