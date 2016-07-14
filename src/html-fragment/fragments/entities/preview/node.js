import BoundingRect from 'common/geom/bounding-rect';
import { mergeBoundingRects }from 'common/utils/geom';
import { calculateBoundingRect, getCapabilities } from './utils';
import CoreObject from 'common/object';

export default class NodePreview extends CoreObject {
  constructor(entity) {
    super();
    this.entity = entity;
  }

  getBoundingRect(zoom) {
    return calculateBoundingRect(this.entity.section.targetNode);
  }

  setBoundingRect() {

  }

  getCapabilities() {
    return getCapabilities(this.entity.section.targetNode);
  }
}
