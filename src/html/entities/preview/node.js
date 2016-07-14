import { calculateBoundingRect, getCapabilities, setBoundingRect, setPositionFromAbsolutePoint } from './utils';
import CoreObject from 'common/object';

export default class NodePreview extends CoreObject {
  constructor(entity) {
    super();
    this.entity = entity;
  }

  getBoundingRect() {
    return calculateBoundingRect(this.entity.section.targetNode);
  }

  setPositionFromAbsolutePoint(point) {
    setPositionFromAbsolutePoint(point, this.entity, this.entity.section.targetNode);
  }

  setBoundingRect(rect) {
    setBoundingRect(rect, this.entity, this.entity.section.targetNode);
  }

  getCapabilities() {
    return getCapabilities(this.entity.section.targetNode);
  }
}
