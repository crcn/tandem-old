import { DisplayEntityComputer } from 'editor/entities';
import {
  calculateZoom,
  translateLength as translateCSSLength
} from 'common/utils/html/css'

class ReactEntityComputer extends DisplayEntityComputer {

  setPositionFromFixedPoint(point) {

    var absStyle = this.getZoomedStyle();
    var entStyle = this.entity.getStyle();

    this.entity.setStyle({
      left : translateCSSLength(absStyle.left, entStyle.left, point.left),
      top  : translateCSSLength(absStyle.top, entStyle.top, point.top)
    });
  }

  setBounds(bounds) {

    // NO zoom here - point is NOT fixed, but relative
    var absStyle = this.getStyle();
    var entStyle = this.entity.getStyle();

    var props = { ...bounds };
    for (var k in bounds) {
      if (entStyle[k] == void 0) continue;
      props[k] = translateCSSLength(
        absStyle[k],
        entStyle[k],
        bounds[k]
      );
    }

    this.entity.setStyle(props);
  }

  getZoom() {
    return calculateZoom(this.displayObject.refs.element);
  }

  getZoomedStyle() {
    var style = this.getStyle();
    var zoom  = this.getZoom();

    return {
      left   : style.left * zoom,
      top    : style.top * zoom,
      width  : style.width * zoom,
      height : style.height * zoom
    };
  }

  getStyle() {

    var refs = this.displayObject.refs;

    if (!refs.element) {
      console.warn('trying to calculate display information on entity that is not mounted');
      return { };
    }

    // eeeesh - this is yucky, but we *need* to offset the position
    // of the preview canvas so that we can get the correct position
    // of this element. This is the *simplest* solution I can think of.
    var pcrect = document.getElementById('preview-canvas').getBoundingClientRect();

    var rect = refs.element.getBoundingClientRect();
    var cs   = window.getComputedStyle(refs.element);

    var w = rect.right - rect.left;
    var h = rect.bottom - rect.top;
    var x = rect.left - pcrect.left;
    var y = rect.top  - pcrect.top;
    var resizable = cs.display !== 'inline';
    var zoom = this.getZoom();

    return {
      resizable : resizable,
      left      : x,
      top       : y,
      width     : w,
      height    : h
    };
  }
}

export default ReactEntityComputer;
