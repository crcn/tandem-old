import { calculateBoundingRect, getCapabilities, setBoundingRect, setPositionFromAbsolutePoint } from './utils';
import CoreObject from 'saffron-common/src/object/index';

export default class NodePreview extends CoreObject {

  constructor(public entity:any, public node:any) {
    super({});
  }

  getBoundingRect(zoomProperties) {
    return calculateBoundingRect(this.entity, this.node, zoomProperties);
  }

  setPositionFromAbsolutePoint(point) {
    setPositionFromAbsolutePoint(point, this.entity, this.node);
  }

  setBoundingRect(rect) {
    setBoundingRect(rect, this.entity, this.node);
  }

  getCapabilities() {
    return getCapabilities(this.node);
  }
}
