import { calculateBoundingRect, getCapabilities, setBoundingRect, setPositionFromAbsolutePoint } from './utils';
import CoreObject from 'saffron-common/lib/object/index';

export default class NodePreview extends CoreObject {

  public entity:any;

  constructor(entity) {
    super({});
    this.entity = entity;
  }

  getBoundingRect(zoomProperties) {
    return calculateBoundingRect(this.entity, this.entity.section.targetNode, zoomProperties);
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
