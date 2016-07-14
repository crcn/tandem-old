import BoundingRect from 'common/geom/bounding-rect';
import { mergeBoundingRects } from 'common/utils/geom';
import { calculateBoundingRect, getCapabilities } from './utils';
import CoreObject from 'common/object';

export default class GroupPreview extends CoreObject {
  constructor(entity) {
    super();
    this.entity = entity;
  }

  getBoundingRect(zoom) {
    var rect = mergeBoundingRects(this.entity.section.childNodes.map(function(node) {
      return calculateBoundingRect(node);
    }));

    return rect;
  }

  setBoundingRect() {

  }

  getCapabilities() {
    return {
      movable: false
    }
  }
}
