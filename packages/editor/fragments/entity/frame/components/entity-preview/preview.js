import BoundingRect from 'common/geom/bounding-rect';
import { DisplayEntityComputer } from 'common/entities';

class FrameEntityPreview extends DisplayEntityComputer {
  constructor(entity, component) {
    super(entity, component);
  }

  getCapabilities() {
    return {
      movable: true
    };
  }

  setBoundingRect(rect) {
    this.entity.setStyle(rect);
  }

  setPositionFromAbsolutePoint(point) {
    this.entity.setStyle(point);
  }

  getBoundingRect() {
    var di = this.displayObject;
    var element = di.refs.frame;
    var style = this.getStyle();

    var rect = element.getBoundingClientRect();
    rect = BoundingRect.create({
      left   : rect.left,
      top    : rect.top,
      right  : rect.right,
      bottom : rect.bottom
    });

    var leftDiff = rect.left - (style.left || 0);
    var topDiff  = rect.top  - (style.top  || 0);

    rect.left = style.left || 0;
    rect.top  = style.top || 0;
    rect.bottom = rect.bottom - topDiff;
    rect.right  = rect.right  - leftDiff;

    return rect;
  }

  getStyle() {
    return this.entity.getStyle();
  }
}

export default FrameEntityPreview;
